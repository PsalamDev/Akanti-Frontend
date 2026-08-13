export function Table({ className = '', children }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto ${className}`}>
      <table className="w-full min-w-[500px]">{children}</table>
    </div>
  );
}

export function TableHead({ children }) {
  return <thead className="bg-gray-50 dark:bg-gray-700">{children}</thead>;
}

export function Th({ className = '', children }) {
  return (
    <th className={`px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>;
}

export function TableRow({ className = '', children }) {
  return <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${className}`}>{children}</tr>;
}

export function Td({ className = '', children }) {
  return <td className={`px-4 sm:px-6 py-4 ${className}`}>{children}</td>;
}
