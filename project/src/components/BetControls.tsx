import React from 'react';
import { Coins } from 'lucide-react';

const BET_AMOUNTS = [5, 20, 50, 100];

interface BetControlsProps {
  onBet: (amount: number) => void;
  disabled: boolean;
  userTokens: number;
}

export const BetControls: React.FC<BetControlsProps> = ({
  onBet,
  disabled,
  userTokens,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 text-xl font-semibold">
        <Coins className="w-6 h-6 text-yellow-500" />
        <span>Vos jetons: {userTokens}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {BET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onBet(amount)}
            disabled={disabled || userTokens < amount}
            className={`
              px-6 py-3 text-lg font-semibold rounded-lg
              ${disabled || userTokens < amount
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 transition-all'
              }
            `}
          >
            {amount} jetons
          </button>
        ))}
      </div>
    </div>
  );
};