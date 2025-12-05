export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      {children}
    </div>
  );
}
