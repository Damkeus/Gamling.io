import React from 'react';
import { Trophy } from 'lucide-react';
import { User } from '../types/database';

interface LeaderboardProps {
  users: User[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.tokens - a.tokens);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Classement</h2>
      </div>
      <div className="space-y-4">
        {sortedUsers.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold
                ${index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-700 text-white' :
                  'bg-gray-200'
                }
              `}>
                {index + 1}
              </span>
              <span className="font-medium">{user.email.split('@')[0]}</span>
            </div>
            <span className="font-bold text-green-600">{user.tokens} jetons</span>
          </div>
        ))}
      </div>
    </div>
  );
};