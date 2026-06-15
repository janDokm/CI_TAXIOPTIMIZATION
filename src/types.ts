/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stop {
  id: number;
  name: string;
  lat: number;   // Simulated coordinates scaled 0 to 100 for SVG
  lng: number;   // Simulated coordinates scaled 0 to 100 for SVG
  color: string;
  isDepot?: boolean;
  orderId?: string;
  timeWindow?: string;
  eta?: string;
  paxName?: string;
  demand?: number; // Pax waiting
}

export interface Taxi {
  id: string;
  name: string; // The route/driver name (Alpha, Beta, Gamma, Delta, Epsilon)
  color: string; // Tailwinds colors or hex (blue, orange, green, yellow)
  driver: string;
  avatar: string;
  rating: number;
  stops: Stop[];
  status: 'Idle' | 'Active' | 'Charging' | 'Completed';
  currentReward: number;
  avgDuration: number;
  totalTrips: number;
}

export interface Trip {
  id: string;
  orderId: string;
  driverId: string;
  driverName: string;
  driverColor: string;
  pickup: string;
  destination: string;
  timeWindow: string;
  eta: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  fare: number;
  passenger: string;
  phone: string;
  notes: string;
}

export interface TrainingDataPoint {
  episode: number;
  qLearningReward: number;
  dqnReward: number;
  qLearningSteps: number;
  dqnSteps: number;
}

export interface Hyperparameters {
  learningRate: number; // Alpha
  discountFactor: number; // Gamma
  explorationRate: number; // Epsilon
  epsilonDecay: number;
  episodes: number;
}
