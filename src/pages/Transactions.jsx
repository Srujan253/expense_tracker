import Layout from '../components/layout/Layout';
import TransactionItem from '../components/transactions/TransactionItem';
import { useTransactions } from '../hooks/useTransactions';
import { useState, useMemo } from 'react';
import { Input } from '../components/ui/Input';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { format, isToday, isYesterday, isThisMonth, parseISO } from 'date-fns';

const Transactions = () => {
  const { transactions, loading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
        
        if (sortBy === 'newest') return dateB - dateA;
        if (sortBy === 'oldest') return dateA - dateB;
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, filterType, filterCategory, sortBy]);

  const groupedTransactions = useMemo(() => {
    const groups = {
      Today: [],
      Yesterday: [],
      'This Month': [],
      Older: []
    };

    filteredTransactions.forEach(t => {
      const date = t.date.toDate ? t.date.toDate() : new Date(t.date);
      if (isToday(date)) groups.Today.push(t);
      else if (isYesterday(date)) groups.Yesterday.push(t);
      else if (isThisMonth(date)) groups['This Month'].push(t);
      else groups.Older.push(t);
    });

    return groups;
  }, [filteredTransactions]);

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Transactions</h1>
            <p className="text-neutral-500">View and manage your transaction history</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-neutral-500">Loading transactions...</p>
          ) : (
            Object.entries(groupedTransactions).map(([group, items]) => (
              items.length > 0 && (
                <div key={group} className="space-y-3">
                  <h3 className="sticky top-0 z-10 bg-neutral-bg py-2 text-sm font-semibold text-neutral-500 backdrop-blur-sm">
                    {group}
                  </h3>
                  <div className="space-y-3">
                    {items.map(t => (
                      <TransactionItem key={t.id} transaction={t} />
                    ))}
                  </div>
                </div>
              )
            ))
          )}
          
          {!loading && filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
              <Filter size={48} className="mb-4 opacity-20" />
              <p>No transactions found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
