import Spinner from './Spinner';

export default function Loading({ className = '', spinnerSize = 'md' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner size={spinnerSize} />
    </div>
  );
}
