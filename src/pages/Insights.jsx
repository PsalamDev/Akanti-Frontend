import { useState } from 'react';
import InsightsPanel from '../components/InsightsPanel';
import AssistantPanel from '../components/AssistantPanel';
import { PageHeader } from '../components/ui';
import { Sparkles, MessageSquare } from 'lucide-react';

const TABS = [
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'assistant', label: 'Ask Akanti', icon: MessageSquare },
];

export default function Insights() {
  const [tab, setTab] = useState('insights');

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        subtitle="A plain-language read on your money, and a place to ask about it"
      />

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id
                ? 'border-green-600 text-green-700 dark:text-green-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'insights' ? <InsightsPanel /> : <AssistantPanel />}
    </div>
  );
}
