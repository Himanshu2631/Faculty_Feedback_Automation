export default function Input({ label, value, onChange, type="text", className='' }) {
  return (
    <div className={`flex flex-col mb-3 ${className}`}>
      <label className="mb-1 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border p-2 rounded"
      />
    </div>
  );
}
