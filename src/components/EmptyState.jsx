export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}
