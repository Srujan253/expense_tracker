import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', user.uid),
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(results);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { transactions, loading, error };
};
