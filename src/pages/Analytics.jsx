import Layout from '../components/layout/Layout';
import { useTransactions } from '../hooks/useTransactions';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, getHours } from 'date-fns';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Calendar, Clock } from 'lucide-react';

const COLORS = ['#10B981', '#F43F5E', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

const Analytics = () => {
  const { transactions, loading } = useTransactions();

  // 1. Pie Chart Data: Category Breakdown
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
    
    const byCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(byCategory)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalExpense) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 2. Bar Chart Data: Monthly Spending
  const monthlyData = useMemo(() => {
    const data = {};
    transactions.forEach(t => {
      const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
      const monthKey = format(date, 'MMM yyyy');
      if (!data[monthKey]) data[monthKey] = { name: monthKey, income: 0, expense: 0 };
      if (t.type === 'income') data[monthKey].income += t.amount;
      else data[monthKey].expense += t.amount;
    });
    return Object.values(data).reverse(); // Oldest to newest
  }, [transactions]);

  // 3. Line Chart Data: Cash Flow
  const cashFlowData = useMemo(() => {
    // Sort transactions by date
    const sorted = [...transactions].sort((a, b) => {
      const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
      return dateA - dateB;
    });

    let balance = 0;
    return sorted.map(t => {
      const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
      if (t.type === 'income') balance += t.amount;
      else balance -= t.amount;
      return {
        date: format(date, 'MMM dd'),
        balance,
        amount: t.amount,
        type: t.type
      };
    });
  }, [transactions]);

  // 4. Heatmap Data: Daily Spending
  const heatmapData = useMemo(() => {
    if (transactions.length === 0) return [];
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const dates = expenses.map(t => t.date.toDate ? t.date.toDate() : new Date(t.date));
    if (dates.length === 0) return [];

    const start = new Date(Math.min(...dates));
    const end = new Date();
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayExpenses = expenses.filter(t => {
        const tDate = t.date.toDate ? t.date.toDate() : new Date(t.date);
        return isSameDay(tDate, day);
      });
      const total = dayExpenses.reduce((acc, t) => acc + t.amount, 0);
      return { date: day, value: total };
    });
  }, [transactions]);

  // 5. Deep Insights
  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Top 3 Categories
    const topCategories = categoryData.slice(0, 3);

    // Most Frequent Spending Day
    const dayCounts = expenses.reduce((acc, t) => {
      const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
      const dayName = format(date, 'EEEE');
      acc[dayName] = (acc[dayName] || 0) + 1;
      return acc;
    }, {});
    const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];

    // Peak Spending Time
    const hourCounts = expenses.reduce((acc, t) => {
      const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
      const hour = getHours(date);
      const period = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      acc[period] = (acc[period] || 0) + 1;
      return acc;
    }, {});
    const topTime = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

    return { topCategories, topDay, topTime };
  }, [transactions, categoryData]);

  const getHeatmapColor = (value) => {
    if (value === 0) return 'bg-neutral-100';
    if (value < 500) return 'bg-emerald-200';
    if (value < 2000) return 'bg-emerald-400';
    return 'bg-emerald-600';
  };

  if (loading) return <Layout><div className="p-8 text-center">Loading analytics...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-500">Deep dive into your financial habits</p>
        </div>

        {/* Top Section: Pie Chart & Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pie Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="mb-4 text-lg font-bold text-neutral-900">Expense Breakdown</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights Cards */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
              <div className="mb-2 flex items-center gap-2 opacity-80">
                <TrendingUp size={20} />
                <span className="text-sm font-medium">Top Expense</span>
              </div>
              <p className="text-2xl font-bold">{insights?.topCategories[0]?.name || 'N/A'}</p>
              <p className="text-sm opacity-80">{insights?.topCategories[0]?.percentage || 0}% of total spending</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Most Active Day</p>
                  <p className="font-bold text-neutral-900">{insights?.topDay?.[0] || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">Peak Spending Time</p>
                  <p className="font-bold text-neutral-900">{insights?.topTime?.[0] || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Monthly Spending */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-neutral-900">Monthly Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#F43F5E" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Cash Flow */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-neutral-900">Cash Flow Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Line type="monotone" dataKey="balance" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-neutral-900">Daily Spending Heatmap</h3>
          <div className="flex flex-wrap gap-1">
            {heatmapData.map((day, i) => (
              <div
                key={i}
                title={`${format(day.date, 'MMM dd')}: ₹${day.value}`}
                className={clsx(
                  "h-4 w-4 rounded-sm transition-colors",
                  getHeatmapColor(day.value)
                )}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-sm bg-neutral-100" />
              <div className="h-3 w-3 rounded-sm bg-emerald-200" />
              <div className="h-3 w-3 rounded-sm bg-emerald-400" />
              <div className="h-3 w-3 rounded-sm bg-emerald-600" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
