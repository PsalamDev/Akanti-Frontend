const tones = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300',
};

export default function Badge({ tone = 'gray', className = '', children }) {
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${tones[tone]} ${className}`}>{children}</span>;
}
