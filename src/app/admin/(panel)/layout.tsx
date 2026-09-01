import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AdminShell
      name={session.name}
      email={session.email}
      role={session.role === "OWNER" ? "Owner" : "Staff"}
    >
      {children}
    </AdminShell>
  );
}
