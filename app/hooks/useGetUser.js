"use client";

import { useState, useEffect, useCallback } from 'react';
import { getSession } from '../login/_actions/login';
import { getUserById } from '../admin/users/_actions/users';

// Custom hook to get user data
const useGetUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get the session
      const {success, session, message} = await getSession();
      if (!success) {
        setError(message);
        setIsLoading(false);
        return;
      }
      // Get the user ID from the session
      const userId = session.id; // Adjust this based on your session structure
      if (!userId) {
        setError('Invalid session data');
        setIsLoading(false);
        return;
      }

      // Fetch the user by ID
      const response = await getUserById(userId);
      if (!response.success) {
        setError(response.message);
        setIsLoading(false);
        return;
      }

      // Set the user data
      setUser(response.user);
      setIsLoading(false);
    } catch (err) {
      console.log("hooks error ", err)
      setError('An error occurred while fetching the user');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, isLoading, error, fetchUser };
};

export default useGetUser;

