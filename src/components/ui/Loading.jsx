import Spinner from './Spinner';

export default function Loading({ className = '', spinnerSize = 'sm' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner size={spinnerSize} />
    </div>
  );
}
