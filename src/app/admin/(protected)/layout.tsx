import AdminLayout from "@/views/admin/AdminLayout";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
