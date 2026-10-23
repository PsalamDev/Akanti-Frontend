const sizes = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export default function Spinner({ size = 'sm', className = '' }) {
  return (
    <img
      src="/akanti-logo.jpeg"
      alt="Akanti loading"
      className={`rounded-lg object-cover animate-pulse ${sizes[size]} ${className}`}
    />
  );
}
