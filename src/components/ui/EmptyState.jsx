export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <p className="text-gray-500 dark:text-gray-400 text-lg flex items-center justify-center gap-2">
        {icon} {title}
      </p>
      {message && <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
