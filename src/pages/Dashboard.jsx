import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import OverviewCard from '../components/dashboard/OverviewCard';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import TransactionList from '../components/transactions/TransactionList';
import TransactionModal from '../components/transactions/TransactionModal';
import { Button } from '../components/ui/Button';
import { useTransactions } from '../hooks/useTransactions';
import { Plus, Minus } from 'lucide-react';

const Dashboard = () => {
  const { transactions, loading } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    // Group transactions by month (simplified for now)
    // In a real app, you'd want more robust date handling
    const data = {};
    transactions.forEach(t => {
      const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!data[month]) data[month] = { name: month, income: 0, expense: 0 };
      if (t.type === 'income') data[month].income += t.amount;
      else data[month].expense += t.amount;
    });
    return Object.values(data).reverse(); // Show oldest to newest if sorted desc
  }, [transactions]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500">Welcome back, here's your financial overview</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => openModal('income')} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus size={20} className="mr-2" />
              Income
            </Button>
            <Button onClick={() => openModal('expense')} className="bg-rose-600 hover:bg-rose-700">
              <Minus size={20} className="mr-2" />
              Expense
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <OverviewCard
            title="Total Income"
            amount={stats.income}
            type="income"
          />
          <OverviewCard
            title="Total Expenses"
            amount={stats.expense}
            type="expense"
          />
          <OverviewCard
            title="Total Balance"
            amount={stats.balance}
            type="balance"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ExpenseChart data={chartData.length > 0 ? chartData : undefined} />
          </div>
          <div className="glass-card p-6">
            <h3 className="mb-4 text-lg font-bold text-neutral-900">Recent Transactions</h3>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <TransactionList transactions={transactions} />
              )}
            </div>
          </div>
        </div>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={modalType}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
