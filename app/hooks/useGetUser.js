"use client";

import { useState, useEffect, useCallback } from 'react';
import { getSession } from '../login/_actions/login';
import { getUserById } from '../admin/users/_actions/users';

// Custom hook to get user data
const useGetUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      // Get the session
      const session = await getSession();
      if (!session) {
        setError('No session found');
        setLoading(false);
        return;
      }
      console.log(session); 
      // Get the user ID from the session
      const userId = session.id; // Adjust this based on your session structure
      if (!userId) {
        setError('Invalid session data');
        setLoading(false);
        return;
      }

      // Fetch the user by ID
      const response = await getUserById(userId);
      if (!response.success) {
        setError(response.message);
        setLoading(false);
        return;
      }

      // Set the user data
      setUser(response.user);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching the user');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, fetchUser };
};

export default useGetUser;

