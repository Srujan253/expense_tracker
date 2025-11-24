import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setProfile({ ...doc.data(), id: doc.id });
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile = {
          displayName: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          username: '',
          bio: '',
          budget: 0,
          createdAt: user.metadata.creationTime,
        };
        setDoc(userRef, initialProfile);
        setProfile(initialProfile);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching profile:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateProfileData = async (data) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      
      // Update Auth profile if name or photo changed
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName || user.displayName,
          photoURL: data.photoURL || user.photoURL
        });
      }
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err);
      return false;
    }
  };

  return { profile, loading, error, updateProfileData };
};
