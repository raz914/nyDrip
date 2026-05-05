import AdminDashboardNav from "@/components/admin/AdminDashboardNav";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <AdminDashboardNav />
      {children}
    </div>
  );
}
