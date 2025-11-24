import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogOut, Check, X, Calendar, Clock } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const Settings = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfileData } = useProfile();
  const [formData, setFormData] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        username: profile.username || '',
        bio: profile.bio || '',
        budget: profile.budget || 0,
      });
      setIsDirty(false);
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Check if data is different from profile
      const hasChanges = 
        newData.displayName !== (profile?.displayName || '') ||
        newData.username !== (profile?.username || '') ||
        newData.bio !== (profile?.bio || '') ||
        newData.budget !== (profile?.budget || 0);
      
      setIsDirty(hasChanges);
      return newData;
    });
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSave = async () => {
    const success = await updateProfileData(formData);
    if (success) {
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        username: profile.username || '',
        bio: profile.bio || '',
        budget: profile.budget || 0,
      });
      setIsDirty(false);
    }
  };

  if (loading) return <Layout><div className="p-8 text-center">Loading profile...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
          <p className="text-neutral-500">Manage your personal information</p>
        </div>

        {/* Profile Header */}
        <div className="glass-card relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
          
          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-neutral-900">{profile?.displayName || 'User'}</h2>
              <p className="text-neutral-500">{profile?.email}</p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-4 sm:justify-start">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Calendar size={14} />
                  <span>Joined {profile?.createdAt ? format(new Date(profile.createdAt), 'MMM yyyy') : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Clock size={14} />
                  <span>Last Login {user?.metadata?.lastSignInTime ? format(new Date(user.metadata.lastSignInTime), 'MMM dd, HH:mm') : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="glass-card space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">Personal Details</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Full Name</label>
              <Input
                value={formData.displayName || ''}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">@</span>
                <Input
                  value={formData.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="username"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Monthly Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">₹</span>
                <Input
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us a bit about yourself..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                rows={3}
              />
            </div>
          </div>

          <AnimatePresence>
            {isDirty && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-end gap-3 pt-4"
              >
                <Button variant="ghost" onClick={handleCancel}>
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Check size={18} className="mr-2" />
                  Save Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account Actions */}
        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-bold text-neutral-900">Account Actions</h3>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
