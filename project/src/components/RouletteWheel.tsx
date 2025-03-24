import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface RouletteWheelProps {
  spinning: boolean;
  onSpinComplete: (number: number) => void;
}

const NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  spinning,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (spinning) {
      const randomSpins = 8 + Math.random() * 4; // 8-12 spins
      const newRotation = rotation + (randomSpins * 360);
      const finalDegree = newRotation % 360;
      const numberIndex = Math.floor((360 - finalDegree) / (360 / NUMBERS.length));
      const resultNumber = NUMBERS[numberIndex];

      setRotation(newRotation);
      setResult(resultNumber);

      const timer = setTimeout(() => {
        onSpinComplete(resultNumber);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [spinning]);

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      <div
        className={cn(
          "absolute w-full h-full rounded-full border-8 border-gold bg-green-800",
          "transition-transform duration-5000 ease-out",
          spinning && "animate-spin"
        )}
        style={{
          transform: `rotate(${rotation}deg)`,
          backgroundImage: `url('https://images.unsplash.com/photo-1461770354136-8f58567b617a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80')`,
          backgroundSize: 'cover',
        }}
      >
        {NUMBERS.map((number, index) => (
          <div
            key={number}
            className={cn(
              "absolute w-8 h-24 -ml-4 -mt-4 origin-bottom text-white text-center",
              number === 0 ? "bg-green-600" : number % 2 === 0 ? "bg-red-600" : "bg-black"
            )}
            style={{
              transform: `rotate(${index * (360 / NUMBERS.length)}deg)`,
            }}
          >
            {number}
          </div>
        ))}
      </div>
      {result !== null && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white">
          {result}
        </div>
      )}
    </div>
  );
};