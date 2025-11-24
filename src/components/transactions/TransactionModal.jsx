import { useState } from 'react';
import Modal from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Calendar, IndianRupee, FileText, Tag } from 'lucide-react';

const incomeCategories = [
  { id: 'salary', label: 'Salary', icon: '💰' },
  { id: 'sold_items', label: 'Sold Items', icon: '🏷️' },
  { id: 'coupons', label: 'Coupons', icon: '🎟️' },
  { id: 'gifts', label: 'Gifts', icon: '🎁' },
  { id: 'others', label: 'Others', icon: '📦' },
];

const expenseCategories = [
  { id: 'food', label: 'Food & Dining', icon: '🍔' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'bills', label: 'Bills & Utilities', icon: '🧾' },
  { id: 'gifts', label: 'Gifts', icon: '🎁' },
  { id: 'rent', label: 'Rent', icon: '🏠' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'others', label: 'Others', icon: '📦' },
];

const TransactionModal = ({ isOpen, onClose, type = 'expense' }) => {
  const { user } = useAuth();
  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(currentCategories[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  // Reset category when type changes
  if (!currentCategories.find(c => c.id === category)) {
    setCategory(currentCategories[0].id);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
        note,
        paymentMethod,
        createdAt: serverTimestamp(),
      });
      onClose();
      setAmount('');
      setDescription('');
      setNote('');
      setPaymentMethod('UPI');
      setCategory(currentCategories[0].id);
    } catch (error) {
      console.error("Error adding transaction: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add New ${type === 'income' ? 'Income' : 'Expense'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <IndianRupee className="absolute left-3 top-3 text-neutral-400" size={20} />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="relative">
          <FileText className="absolute left-3 top-3 text-neutral-400" size={20} />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="pl-10"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Tag className="absolute left-3 top-3 text-neutral-400" size={20} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 pl-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {currentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-neutral-400" size={20} />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[80px]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Add Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
