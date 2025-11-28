export default function Input({ label, value, onChange, type = "text", name, required, placeholder }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}  
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
