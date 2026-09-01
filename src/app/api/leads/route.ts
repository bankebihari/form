import { NextRequest } from "next/server";
import {
  clientIp,
  fail,
  handleError,
  ok,
  rateLimit,
  tooManyRequests,
} from "@/lib/api";
import { connectDB } from "@/lib/db";
import { leadInputSchema } from "@/lib/validation";
import { Lead } from "@/models/Lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limit = rateLimit(`lead:${ip}`, 8, 10 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests();

    const parsed = leadInputSchema.safeParse(await request.json());
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!errors[key]) errors[key] = issue.message;
      }
      return fail("Please check the highlighted fields.", 422, errors);
    }

    const input = parsed.data;

    // Honeypot — accept silently so bots get no signal.
    if (input.website) return ok({ received: true });

    await connectDB();

    const lead = await Lead.create({
      type: input.type,
      name: input.name,
      phone: input.phone,
      email: input.email,
      city: input.city,
      serviceSlug: input.serviceSlug,
      serviceTitle: input.serviceTitle,
      message: input.message,
      preferredDate: input.preferredDate,
      preferredSlot: input.preferredSlot,
      status: "NEW",
      source: "WEBSITE",
    });

    return ok({ received: true, id: String(lead._id) }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
