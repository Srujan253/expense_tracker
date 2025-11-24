import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/ui/Button';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Manage your account and preferences</p>
        </div>

        <div className="glass-card space-y-6 p-6 dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Profile</h2>
              <p className="text-neutral-500 dark:text-neutral-400">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700">
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-700"
              >
                {theme === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
              </Button>
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Account</h3>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-neutral-600 dark:hover:bg-red-900/20"
            >
              <LogOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
