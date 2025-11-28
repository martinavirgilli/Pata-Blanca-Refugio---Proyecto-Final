export default function Badge({ text, variant = "default" }) {
  const variants = {
    default: "bg-green-100 text-green-700",
    planificada: "bg-blue-100 text-blue-700",
    realizada: "bg-green-100 text-green-700",
    cancelada: "bg-red-100 text-red-700",
  };

  const className = variants[variant] || variants[text?.toLowerCase()] || variants.default;

  return (
    <span className={`inline-block ${className} text-xs px-2 py-1 rounded mt-2`}>
      {text}
    </span>
  );
}
