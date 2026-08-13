const sizes = {
  sm: 'h-8 w-8 border-b-2',
  md: 'h-12 w-12 border-b-2',
};

export default function Spinner({ size = 'sm', className = '' }) {
  return <div className={`animate-spin rounded-full border-green-600 ${sizes[size]} ${className}`} />;
}
