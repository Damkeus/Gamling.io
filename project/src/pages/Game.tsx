import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { RouletteWheel } from '../components/RouletteWheel';
import { BetControls } from '../components/BetControls';
import { Leaderboard } from '../components/Leaderboard';
import { BetHistory } from '../components/BetHistory';
import { supabase } from '../lib/supabase';
import type { User, Bet } from '../types/database';

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const { isDemoMode } = useAuthStore();
  const [spinning, setSpinning] = useState(false);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication and fetch user data
    const initializeUser = async () => {
      if (isDemoMode) {
        setCurrentUser({
          id: 'demo-user',
          email: 'demo@example.com',
          tokens: 1000,
          created_at: new Date().toISOString()
        });
        return;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        navigate('/login');
        return;
      }

      // Fetch full user data including tokens
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userData) {
        setCurrentUser(userData);
      } else {
        // Create new user record if it doesn't exist
        const { data: newUser } = await supabase
          .from('users')
          .insert([
            {
              id: authUser.id,
              email: authUser.email,
              tokens: 1000
            }
          ])
          .select()
          .single();

        if (newUser) {
          setCurrentUser(newUser);
        }
      }
    };

    initializeUser();
  }, [navigate, isDemoMode]);

  useEffect(() => {
    if (!currentUser) return;

    if (!isDemoMode) {
      // Load leaderboard
      const fetchUsers = async () => {
        const { data } = await supabase
          .from('users')
          .select('*')
          .order('tokens', { ascending: false })
          .limit(10);
        if (data) setUsers(data);
      };

      // Load bet history
      const fetchBets = async () => {
        const { data } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(10);
        if (data) setBets(data);
      };

      fetchUsers();
      fetchBets();

      // Set up real-time subscription for leaderboard updates
      const usersSubscription = supabase
        .channel('users_channel')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'users'
        }, () => {
          fetchUsers();
        })
        .subscribe();

      return () => {
        usersSubscription.unsubscribe();
      };
    }
  }, [currentUser, isDemoMode]);

  const handleBet = async (amount: number) => {
    if (!currentUser || spinning || currentUser.tokens < amount) return;
    
    if (!isDemoMode) {
      // Immediately deduct tokens to prevent double betting
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ tokens: currentUser.tokens - amount })
        .eq('id', currentUser.id)
        .select()
        .single();

      if (updatedUser) {
        setCurrentUser(updatedUser);
        setCurrentBet(amount);
        setSpinning(true);
      }
    } else {
      // Handle demo mode betting
      setCurrentUser({
        ...currentUser,
        tokens: currentUser.tokens - amount
      });
      setCurrentBet(amount);
      setSpinning(true);
    }
  };

  const handleSpinComplete = async (result: number) => {
    if (!currentUser || currentBet === null) return;

    const won = result === currentBet;
    const winAmount = won ? currentBet * 35 : 0;
    const newTokens = currentUser.tokens + winAmount;

    if (!isDemoMode) {
      // Update user tokens
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ tokens: newTokens })
        .eq('id', currentUser.id)
        .select()
        .single();

      // Record bet
      const { data: newBet } = await supabase
        .from('bets')
        .insert({
          user_id: currentUser.id,
          amount: currentBet,
          number: currentBet,
          result,
          won
        })
        .select()
        .single();

      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
      if (newBet) {
        setBets([newBet, ...bets.slice(0, 9)]);
      }
    } else {
      // Handle demo mode spin complete
      setCurrentUser({
        ...currentUser,
        tokens: newTokens
      });
      const newBet: Bet = {
        id: `demo-${Date.now()}`,
        user_id: currentUser.id,
        amount: currentBet,
        number: currentBet,
        result,
        won,
        created_at: new Date().toISOString()
      };
      setBets([newBet, ...bets.slice(0, 9)]);
    }

    setSpinning(false);
    setCurrentBet(null);
  };

  const handleSignOut = async () => {
    if (!isDemoMode) {
      await supabase.auth.signOut();
    }
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Roulette Casino {isDemoMode && '(Mode Démo)'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">
              {isDemoMode ? 'Utilisateur Démo' : currentUser.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {isDemoMode ? 'Quitter' : 'Déconnexion'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RouletteWheel
              spinning={spinning}
              onSpinComplete={handleSpinComplete}
            />
            <BetControls
              onBet={handleBet}
              disabled={spinning}
              userTokens={currentUser.tokens}
            />
          </div>

          <div className="space-y-8">
            {!isDemoMode && <Leaderboard users={users} />}
            <BetHistory bets={bets} />
          </div>
        </div>
      </div>
    </div>
  );
};