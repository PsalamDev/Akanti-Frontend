import { useEffect, useState } from 'react';
import { aiAPI } from '../services/api';
import { Button, Badge } from '../components/ui';
import toast from 'react-hot-toast';
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  Lightbulb,
  AlertTriangle,
  Target,
  Info,
  PiggyBank,
} from 'lucide-react';

const money = (n) => `₦${Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;

const SEVERITY = {
  good: {
    wrap: 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20',
    icon: TrendingUp,
    iconClass: 'text-green-600 dark:text-green-400',
    label: 'Good',
    badge: 'green',
  },
  info: {
    wrap: 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20',
    icon: Info,
    iconClass: 'text-blue-600 dark:text-blue-400',
    label: 'Insight',
    badge: 'blue',
  },
  warning: {
    wrap: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20',
    icon: AlertTriangle,
    iconClass: 'text-amber-600 dark:text-amber-400',
    label: 'Warning',
    badge: 'yellow',
  },
  critical: {
    wrap: 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20',
    icon: AlertTriangle,
    iconClass: 'text-red-600 dark:text-red-400',
    label: 'Critical',
    badge: 'red',
  },
};

function InsightList({ title, description, icon: Icon, items, emptyText }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={18} className="text-gray-500 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        <Badge tone="gray">{items.length}</Badge>
      </div>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>}

      <div className="space-y-3">
        {items.map((item, index) => {
          const style = SEVERITY[item.severity] || SEVERITY.info;
          const ItemIcon = style.icon;
          return (
            <div key={index} className={`rounded-lg border p-4 ${style.wrap}`}>
              <div className="flex items-start gap-3">
                <ItemIcon size={18} className={`mt-0.5 shrink-0 ${style.iconClass}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <Badge tone={style.badge}>{style.label}</Badge>
                  </div>
                  {item.detail && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.detail}</p>
                  )}
                  {item.action && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <span className="font-medium">Next step:</span> {item.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function InsightsPanel() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (force = false) => {
    try {
      const { data } = force
        ? await aiAPI.refreshInsights()
        : await aiAPI.getInsights();
      setInsights(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">Insights could not be loaded.</p>
        <Button onClick={() => load()} className="mt-4">Try again</Button>
      </div>
    );
  }

  const snapshot = insights.snapshot;
  const isAi = insights.source === 'ai';
  const generatedAt = insights.generatedAt
    ? new Date(insights.generatedAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  return (
    <div className="space-y-6">
      {insights.notice && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{insights.notice}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone={isAi ? 'green' : 'gray'}>
            {isAi ? 'AI generated' : 'Calculated from your records'}
          </Badge>
          {generatedAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400">Updated {generatedAt}</span>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="secondary"
          size="sm"
        >
          <RefreshCw size={14} className={`inline mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {snapshot && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
              Income
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{money(snapshot.income)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
              Spending
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{money(snapshot.expenses)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Wallet size={16} className={snapshot.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
              Net
            </div>
            <p className={`text-2xl font-bold mt-1 ${snapshot.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {money(snapshot.net)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <PiggyBank size={16} className="text-blue-600 dark:text-blue-400" />
              Savings rate
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{snapshot.savingsRate}%</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {insights.periodLabel}
          </h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{insights.summary}</p>
      </div>

      <InsightList
        title="Highlights"
        description="What went well this period."
        icon={Lightbulb}
        items={insights.highlights}
      />

      <InsightList
        title="Warnings"
        description="Things worth your attention."
        icon={AlertTriangle}
        items={insights.warnings}
      />

      <InsightList
        title="Recommendations"
        description="Concrete steps you could take next."
        icon={Target}
        items={insights.recommendations}
      />

      {snapshot && snapshot.expenseByCategory?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Where the money went
          </h2>
          <div className="space-y-3">
            {snapshot.expenseByCategory.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {money(c.amount)} · {c.sharePercent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${Math.min(100, Math.max(2, c.sharePercent))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        AI insights are generated from your aggregate totals only — transaction names,
        descriptions and amounts are never sent to the AI provider. They are information,
        not financial advice.
      </p>
    </div>
  );
}
