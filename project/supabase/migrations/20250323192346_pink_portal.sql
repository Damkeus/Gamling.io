/*
  # Initial Schema Setup for Casino Roulette

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - tokens (integer)
      - created_at (timestamp)
    
    - bets
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - amount (integer)
      - number (integer)
      - result (integer)
      - won (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  tokens integer DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

-- Bets table
CREATE TABLE bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  amount integer NOT NULL,
  number integer NOT NULL,
  result integer NOT NULL,
  won boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read leaderboard"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for bets table
CREATE POLICY "Users can read their own bets"
  ON bets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bets"
  ON bets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);