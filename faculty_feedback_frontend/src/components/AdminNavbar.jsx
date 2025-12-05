import { Link } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-6">
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/faculty">Manage Faculty</Link>
      <Link to="/admin/subjects">Manage Subjects</Link>
      <Link to="/admin/summary">Feedback Summary</Link>
    </nav>
  );
}
