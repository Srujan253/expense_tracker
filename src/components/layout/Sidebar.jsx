import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Settings, LogOut, PieChart } from 'lucide-react';
import { clsx } from 'clsx';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' }, // Placeholder for future
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-neutral-200 bg-white transition-transform md:translate-x-0">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Receipt size={24} />
          </div>
          <span className="text-xl font-bold text-neutral-900">ExpenseTracker</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-200 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
