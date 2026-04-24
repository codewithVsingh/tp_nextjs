import AdminLayout from "@/modules/admin/layout/AdminLayout";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

