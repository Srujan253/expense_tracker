import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { clsx } from 'clsx';

const ExpenseChart = ({ data }) => {
  // Mock data if none provided
  const chartData = data || [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
  ];

  return (
    <div className="glass-card h-[400px] w-full p-6">
      <h3 className="mb-6 text-lg font-bold text-neutral-900">Financial Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}
          />
          <Bar 
            dataKey="income" 
            fill="#6750A4" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
          />
          <Bar 
            dataKey="expense" 
            fill="#EADDFF" 
            radius={[4, 4, 0, 0]} 
            barSize={20} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
