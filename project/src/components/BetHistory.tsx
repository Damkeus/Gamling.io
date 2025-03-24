import React from 'react';
import { History } from 'lucide-react';
import { Bet } from '../types/database';

interface BetHistoryProps {
  bets: Bet[];
}

export const BetHistory: React.FC<BetHistoryProps> = ({ bets }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Historique</h2>
      </div>
      <div className="space-y-3">
        {bets.map((bet) => (
          <div
            key={bet.id}
            className={`
              p-3 rounded-lg border-l-4
              ${bet.won ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Mise: {bet.amount} jetons sur {bet.number}
              </span>
              <span className={`font-bold ${bet.won ? 'text-green-600' : 'text-red-600'}`}>
                {bet.won ? `+${bet.amount * 35}` : `-${bet.amount}`}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Résultat: {bet.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};