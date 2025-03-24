export interface User {
  id: string;
  email: string;
  tokens: number;
  created_at: string;
}

export interface Bet {
  id: string;
  user_id: string;
  amount: number;
  number: number;
  result: number;
  won: boolean;
  created_at: string;
}