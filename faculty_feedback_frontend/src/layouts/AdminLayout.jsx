import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminNavbar />
      <div className="p-6 bg-gray-100 min-h-screen">{children}</div>
    </div>
  );
}
