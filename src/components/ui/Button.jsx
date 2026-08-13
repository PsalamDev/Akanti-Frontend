const variants = {
  primary: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  info: 'bg-blue-600 hover:bg-blue-700 text-white',
  purple: 'bg-purple-600 hover:bg-purple-700 text-white',
  secondary: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500',
  link: 'text-green-600 hover:underline font-medium',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
};

export default function Button({ variant = 'primary', size = 'md', type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`rounded-lg font-medium transition-colors whitespace-nowrap ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
