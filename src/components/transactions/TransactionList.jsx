import TransactionItem from './TransactionItem';
import { AnimatePresence } from 'framer-motion';

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode='popLayout'>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
