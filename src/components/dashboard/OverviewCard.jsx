import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { clsx } from 'clsx';

const OverviewCard = ({ title, amount, type, icon: Icon }) => {
  const variants = {
    income: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    expense: "bg-gradient-to-br from-rose-400 to-rose-600",
    balance: "bg-gradient-to-br from-primary to-accent-middle",
  };

  const icons = {
    income: ArrowUpRight,
    expense: ArrowDownRight,
    balance: Wallet,
  };

  const SelectedIcon = Icon || icons[type] || Wallet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={clsx(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-elevation transition-all",
        variants[type]
      )}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">
            ₹{amount.toLocaleString()}
          </h3>
        </div>
        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
          <SelectedIcon size={24} className="text-white" />
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-black/5 blur-2xl" />
    </motion.div>
  );
};

export default OverviewCard;
