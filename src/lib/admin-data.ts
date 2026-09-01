import { connectDB, serialize } from "@/lib/db";
import { Application } from "@/models/Application";
import { Lead } from "@/models/Lead";
import type { ApplicationStatus } from "@/lib/constants";
import type { PlainApplication, LeadDocPlain } from "@/types";

export type DashboardStats = {
  total: number;
  byStatus: Record<string, number>;
  today: number;
  awaitingQuote: number;
  awaitingAdvance: number;
  inProgress: number;
  awaitingBalance: number;
  delivered: number;
  collected: number;
  outstanding: number;
  newLeads: number;
  recentApplications: PlainApplication[];
  recentLeads: LeadDocPlain[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [statusRows, todayCount, newLeads, recentApplications, recentLeads, money] =
    await Promise.all([
      Application.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Application.countDocuments({ createdAt: { $gte: startOfDay } }),
      Lead.countDocuments({ status: "NEW" }),
      Application.find().sort({ createdAt: -1 }).limit(8).lean(),
      Lead.find().sort({ createdAt: -1 }).limit(6).lean(),
      Application.aggregate<{
        _id: null;
        collected: number;
        quoted: number;
      }>([
        {
          $group: {
            _id: null,
            collected: {
              $sum: {
                $add: [
                  {
                    $cond: [
                      { $eq: ["$payments.advance.status", "RECEIVED"] },
                      "$payments.advance.amount",
                      0,
                    ],
                  },
                  {
                    $cond: [
                      { $eq: ["$payments.balance.status", "RECEIVED"] },
                      "$payments.balance.amount",
                      0,
                    ],
                  },
                ],
              },
            },
            quoted: { $sum: "$quote.totalAmount" },
          },
        },
      ]),
    ]);

  const byStatus: Record<string, number> = {};
  for (const row of statusRows) byStatus[row._id] = row.count;

  const collected = money[0]?.collected ?? 0;
  const quoted = money[0]?.quoted ?? 0;

  return {
    total: statusRows.reduce((sum, row) => sum + row.count, 0),
    byStatus,
    today: todayCount,
    awaitingQuote: byStatus.SUBMITTED ?? 0,
    awaitingAdvance: byStatus.QUOTED ?? 0,
    inProgress: (byStatus.ADVANCE_PAID ?? 0) + (byStatus.IN_PROGRESS ?? 0),
    awaitingBalance: byStatus.READY_PREVIEW ?? 0,
    delivered: byStatus.DELIVERED ?? 0,
    collected,
    outstanding: Math.max(quoted - collected, 0),
    newLeads,
    recentApplications: serialize(recentApplications) as unknown as PlainApplication[],
    recentLeads: serialize(recentLeads) as unknown as LeadDocPlain[],
  };
}

export type ApplicationFilters = {
  status?: string;
  q?: string;
  page?: number;
  perPage?: number;
};

export async function listApplications(filters: ApplicationFilters) {
  await connectDB();

  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(filters.perPage ?? 20, 100);

  const query: Record<string, unknown> = {};
  if (filters.status && filters.status !== "ALL") {
    query.status = filters.status as ApplicationStatus;
  }
  if (filters.q) {
    const term = filters.q.trim();
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { trackingId: new RegExp(safe, "i") },
      { "applicant.name": new RegExp(safe, "i") },
      { "applicant.phone": new RegExp(safe, "i") },
      { "service.title": new RegExp(safe, "i") },
    ];
  }

  const [rows, total] = await Promise.all([
    Application.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
    Application.countDocuments(query),
  ]);

  return {
    items: serialize(rows) as unknown as PlainApplication[],
    total,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getApplication(id: string) {
  await connectDB();
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return null;
  const doc = await Application.findById(id).lean();
  return doc ? (serialize(doc) as unknown as PlainApplication) : null;
}

export async function listLeads(filters: {
  status?: string;
  type?: string;
  page?: number;
}) {
  await connectDB();

  const page = Math.max(1, filters.page ?? 1);
  const perPage = 25;

  const query: Record<string, unknown> = {};
  if (filters.status && filters.status !== "ALL") query.status = filters.status;
  if (filters.type && filters.type !== "ALL") query.type = filters.type;

  const [rows, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
    Lead.countDocuments(query),
  ]);

  return {
    items: serialize(rows) as unknown as LeadDocPlain[],
    total,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

/* ---------------------------------------------------------------- money ---
   Payments live inside each application, so the ledger is built by flattening
   the two payment stages into rows. Everything here is money a staff member
   has confirmed by hand - the site never processes a payment itself.
   -------------------------------------------------------------------------- */

export type LedgerRow = {
  trackingId: string;
  name: string;
  phone: string;
  service: string;
  stage: "Booking" | "Balance";
  amount: number;
  method?: string;
  reference?: string;
  receivedAt: string;
  recordedBy?: string;
};

export type PendingRow = {
  _id: string;
  trackingId: string;
  name: string;
  phone: string;
  service: string;
  amount: number;
  stage: "Booking" | "Balance";
  since: string;
};

export type Collections = {
  collectedToday: number;
  collectedMonth: number;
  collectedTotal: number;
  quotedTotal: number;
  outstanding: number;
  ledger: LedgerRow[];
  pendingBooking: PendingRow[];
  pendingBalance: PendingRow[];
};

const stageRows = {
  $project: {
    trackingId: 1,
    applicant: 1,
    service: 1,
    rows: [
      {
        stage: "Booking",
        amount: "$payments.advance.amount",
        status: "$payments.advance.status",
        method: "$payments.advance.method",
        reference: "$payments.advance.reference",
        receivedAt: "$payments.advance.receivedAt",
        recordedBy: "$payments.advance.recordedBy",
      },
      {
        stage: "Balance",
        amount: "$payments.balance.amount",
        status: "$payments.balance.status",
        method: "$payments.balance.method",
        reference: "$payments.balance.reference",
        receivedAt: "$payments.balance.receivedAt",
        recordedBy: "$payments.balance.recordedBy",
      },
    ],
  },
};

export async function getCollections(): Promise<Collections> {
  await connectDB();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  type RawRow = {
    trackingId: string;
    applicant: { name: string; phone: string };
    service: { title: string };
    rows: {
      stage: "Booking" | "Balance";
      amount: number;
      status: string;
      method?: string;
      reference?: string;
      receivedAt?: Date;
      recordedBy?: string;
    };
  };

  const [received, quotedAgg, pendingDocs] = await Promise.all([
    Application.aggregate<RawRow>([
      stageRows,
      { $unwind: "$rows" },
      { $match: { "rows.status": "RECEIVED" } },
      { $sort: { "rows.receivedAt": -1 } },
      { $limit: 200 },
    ]),
    Application.aggregate<{ _id: null; quoted: number }>([
      { $match: { status: { $nin: ["CANCELLED"] } } },
      { $group: { _id: null, quoted: { $sum: "$quote.totalAmount" } } },
    ]),
    Application.find({
      status: { $nin: ["CANCELLED", "DELIVERED"] },
      "quote.totalAmount": { $gt: 0 },
      $or: [
        { "payments.advance.status": "PENDING" },
        { "payments.balance.status": "PENDING" },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean(),
  ]);

  const ledger: LedgerRow[] = received.map((row) => ({
    trackingId: row.trackingId,
    name: row.applicant.name,
    phone: row.applicant.phone,
    service: row.service.title,
    stage: row.rows.stage,
    amount: row.rows.amount ?? 0,
    method: row.rows.method,
    reference: row.rows.reference,
    receivedAt: new Date(row.rows.receivedAt ?? Date.now()).toISOString(),
    recordedBy: row.rows.recordedBy,
  }));

  const sum = (rows: LedgerRow[]) =>
    rows.reduce((total, row) => total + row.amount, 0);

  const collectedTotal = sum(ledger);
  const collectedToday = sum(
    ledger.filter((row) => new Date(row.receivedAt) >= startOfDay)
  );
  const collectedMonth = sum(
    ledger.filter((row) => new Date(row.receivedAt) >= startOfMonth)
  );
  const quotedTotal = quotedAgg[0]?.quoted ?? 0;

  const pendingBooking: PendingRow[] = [];
  const pendingBalance: PendingRow[] = [];

  for (const doc of pendingDocs) {
    // `applicant` and `service` are required by the schema, but lean() types
    // them as optional, so fall back rather than assert.
    const base = {
      _id: String(doc._id),
      trackingId: doc.trackingId,
      name: doc.applicant?.name ?? "Unknown",
      phone: doc.applicant?.phone ?? "",
      service: doc.service?.title ?? "—",
      since: new Date(doc.createdAt as unknown as string).toISOString(),
    };
    if (doc.payments.advance.status === "PENDING") {
      pendingBooking.push({
        ...base,
        stage: "Booking",
        amount: doc.payments.advance.amount ?? 0,
      });
    } else if (doc.payments.balance.status === "PENDING") {
      pendingBalance.push({
        ...base,
        stage: "Balance",
        amount: doc.payments.balance.amount ?? 0,
      });
    }
  }

  return {
    collectedToday,
    collectedMonth,
    collectedTotal,
    quotedTotal,
    outstanding: Math.max(quotedTotal - collectedTotal, 0),
    ledger,
    pendingBooking,
    pendingBalance,
  };
}
