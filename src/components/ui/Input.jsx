const base = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50';

export default function Input({ label, as = 'input', className = '', children, ...props }) {
  const field =
    as === 'textarea' ? (
      <textarea className={`${base} ${className}`} {...props} />
    ) : as === 'select' ? (
      <select className={`${base} ${className}`} {...props}>
        {children}
      </select>
    ) : (
      <input className={`${base} ${className}`} {...props} />
    );

  if (!label) return field;

  return (
    <label className="block">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className="mt-1">{field}</div>
    </label>
  );
}
