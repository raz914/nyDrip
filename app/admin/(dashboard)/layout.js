import AdminDashboardNav from "@/components/admin/AdminDashboardNav";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f6f6] md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      <AdminDashboardNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
