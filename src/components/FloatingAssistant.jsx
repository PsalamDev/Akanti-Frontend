import { MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function FloatingAssistant() {
  const location = useLocation();
  
  // Don't show on the assistant page itself
  if (location.pathname === '/dashboard/assistant') {
    return null;
  }

  return (
    <Link
      to="/dashboard/assistant"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      title="Ask Akanti"
    >
      <MessageSquare size={20} />
      <span className="hidden sm:inline font-medium">Ask Akanti</span>
    </Link>
  );
}
