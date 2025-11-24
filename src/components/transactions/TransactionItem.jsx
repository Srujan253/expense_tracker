import { motion } from 'framer-motion';
import { Trash2, Edit2, Tag as TagIcon, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { clsx } from 'clsx';

const TransactionItem = ({ transaction }) => {
  const { id, description, amount, type, date, category, paymentMethod, note } = transaction;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteDoc(doc(db, 'transactions', id));
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(dateObj);
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Card': return <CreditCard size={14} />;
      case 'Cash': return <Banknote size={14} />;
      case 'UPI': return <Smartphone size={14} />;
      default: return <Smartphone size={14} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group relative flex items-center justify-between rounded-xl bg-neutral-50 p-4 transition-all hover:bg-white hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className={clsx(
          "flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-sm",
          type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
        )}>
          {type === 'income' ? '💰' : '💸'}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span>{formatDate(date)}</span>
            <span>•</span>
            <span className="flex items-center gap-1 rounded-full bg-neutral-200 px-2 py-0.5">
              <TagIcon size={12} /> {category}
            </span>
            {paymentMethod && (
              <span className="flex items-center gap-1 rounded-full bg-neutral-200 px-2 py-0.5">
                {getPaymentIcon(paymentMethod)} {paymentMethod}
              </span>
            )}
          </div>
          {note && <p className="mt-1 text-xs italic text-neutral-400">{note}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={clsx(
          "text-lg font-bold",
          type === 'income' ? "text-emerald-600" : "text-rose-600"
        )}>
          {type === 'income' ? '+' : '-'}₹{Math.abs(amount).toFixed(2)}
        </span>
        
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleDelete}
            className="rounded-lg p-2 text-neutral-400 hover:bg-rose-50 hover:text-rose-500"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionItem;
