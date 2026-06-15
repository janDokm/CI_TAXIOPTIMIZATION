/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Taxi, Trip, TrainingDataPoint, Stop } from '../types';

export const KL_LANDMARKS = [
  { name: 'KLCC Twin Towers', lng: 70, lat: 35, icon: 'building' },
  { name: 'Menara KL', lng: 55, lat: 45, icon: 'tower' },
  { name: 'Merdeka 118', lng: 50, lat: 60, icon: 'spire' },
  { name: 'Damansara Heights', lng: 15, lat: 35, icon: 'trees' },
  { name: 'Bangsar South', lng: 22, lat: 82, icon: 'hub' },
  { name: 'KL Sentral (Depot)', lng: 45, lat: 70, icon: 'depot' },
  { name: 'UTM KL Campus', lng: 85, lat: 18, icon: 'school' },
  { name: 'Titiwangsa Park', lng: 58, lat: 16, icon: 'lake' },
];

export const DEPOT_STOP: Stop = {
  id: 0,
  name: 'Eleven-Nine Central Depot (KL Sentral)',
  lng: 48,
  lat: 65,
  color: '#8B0000', // UTM Dark Red
  isDepot: true,
};

export const INITIAL_TAXIS: Taxi[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    driver: 'Alpha',
    avatar: '',
    color: '#3B82F6', // Blue
    rating: 4.8,
    status: 'Active',
    currentReward: 1820,
    avgDuration: 24.5,
    totalTrips: 340,
    stops: [
      { id: 101, name: 'Bangsar Telawi / Alpha', lng: 25, lat: 58, color: '#3B82F6', orderId: 'TX-9051', timeWindow: '07:00 - 09:00', eta: '07:15', paxName: 'Ahmad Faiz', demand: 1 },
      { id: 102, name: 'Pusat Bandar Damansara', lng: 18, lat: 46, color: '#3B82F6', orderId: 'TX-9052', timeWindow: '09:00 - 11:30', eta: '09:20', paxName: 'Sarah Lim', demand: 0 },
      { id: 103, name: 'Damansara Heights West', lng: 12, lat: 38, color: '#3B82F6', orderId: 'TX-9053', timeWindow: '12:00 - 14:00', eta: '12:10', paxName: 'John Doe', demand: 2 },
      { id: 104, name: 'Mid Valley Megamall', lng: 28, lat: 76, color: '#3B82F6', orderId: 'TX-9054', timeWindow: '15:00 - 17:00', eta: '15:25', paxName: 'Farhana Jamil', demand: 1 },
      { id: 105, name: 'Bangsar South Nexus', lng: 22, lat: 85, color: '#3B82F6', orderId: 'TX-9055', timeWindow: '18:00 - 20:00', eta: '18:30', paxName: 'Michael Tan', demand: 0 },
    ]
  },
  {
    id: 'beta',
    name: 'Beta',
    driver: 'Beta',
    avatar: '',
    color: '#F97316', // Orange
    rating: 4.9,
    status: 'Active',
    currentReward: 2150,
    avgDuration: 18.2,
    totalTrips: 420,
    stops: [
      { id: 201, name: 'Sentul East Metro', lng: 48, lat: 21, color: '#F97316', orderId: 'TX-8831', timeWindow: '08:00 - 10:00', eta: '08:20', paxName: 'Divya Nair', demand: 1 },
      { id: 202, name: 'Titiwangsa Lake Gardens', lng: 60, lat: 22, color: '#F97316', orderId: 'TX-8832', timeWindow: '10:30 - 12:00', eta: '10:45', paxName: 'Wong Siew', demand: 0 },
      { id: 203, name: 'Chow Kit Bazaar', lng: 52, lat: 33, color: '#F97316', orderId: 'TX-8833', timeWindow: '12:30 - 14:30', eta: '13:00', paxName: 'Hafiz Hamdan', demand: 3 },
      { id: 204, name: 'Kampung Baru foodcourt', lng: 64, lat: 30, color: '#F97316', orderId: 'TX-8834', timeWindow: '15:00 - 17:00', eta: '15:15', paxName: 'Nurul Ain', demand: 0 },
      { id: 205, name: 'PWTC Convention Center', lng: 38, lat: 28, color: '#F97316', orderId: 'TX-8835', timeWindow: '17:30 - 19:30', eta: '17:50', paxName: 'Cheng Wei', demand: 1 },
    ]
  },
  {
    id: 'gamma',
    name: 'Gamma',
    driver: 'Gamma',
    avatar: '',
    color: '#10B981', // Green
    rating: 4.7,
    status: 'Active',
    currentReward: 1980,
    avgDuration: 22.8,
    totalTrips: 385,
    stops: [
      { id: 301, name: 'KLCC G-Floor Lobby', lng: 72, lat: 35, color: '#10B981', orderId: 'TX-7011', timeWindow: '07:30 - 09:30', eta: '07:50', paxName: 'Sofia Lee', demand: 2 },
      { id: 302, name: 'Pavilion Bukit Bintang', lng: 76, lat: 51, color: '#10B981', orderId: 'TX-7012', timeWindow: '10:00 - 12:00', eta: '10:20', paxName: 'Sanjay Kumar', demand: 1 },
      { id: 303, name: 'Tun Razak Exchange TRX', lng: 82, lat: 58, color: '#10B981', orderId: 'TX-7013', timeWindow: '13:00 - 15:00', eta: '13:15', paxName: 'Yusuf Islam', demand: 0 },
      { id: 304, name: 'Merdeka 118 Plaza', lng: 55, lat: 60, color: '#10B981', orderId: 'TX-7014', timeWindow: '16:00 - 18:00', eta: '16:30', paxName: 'Ameera Latif', demand: 1 },
      { id: 305, name: 'Petaling Street (Chinatown)', lng: 44, lat: 54, color: '#10B981', orderId: 'TX-7015', timeWindow: '18:30 - 20:30', eta: '19:00', paxName: 'Chloe Yap', demand: 0 },
    ]
  },
  {
    id: 'delta',
    name: 'Delta',
    driver: 'Delta',
    avatar: '',
    color: '#EAB308', // Yellow
    rating: 4.95,
    status: 'Active',
    currentReward: 2410,
    avgDuration: 16.9,
    totalTrips: 490,
    stops: [
      { id: 401, name: 'UTM KL Block G Campus', lng: 85, lat: 18, color: '#EAB308', orderId: 'TX-5201', timeWindow: '08:00 - 09:30', eta: '08:15', paxName: 'Prof. Dr. Kamal', demand: 2 },
      { id: 402, name: 'Datuk Keramat LRT', lng: 80, lat: 28, color: '#EAB308', orderId: 'TX-5202', timeWindow: '10:00 - 11:30', eta: '10:10', paxName: 'Hana Anuar', demand: 0 },
      { id: 403, name: 'Ampang Point Mall', lng: 90, lat: 38, color: '#EAB308', orderId: 'TX-5203', timeWindow: '12:00 - 13:30', eta: '12:20', paxName: 'Daniel Harris', demand: 1 },
      { id: 404, name: 'Pandan Indah Heights', lng: 89, lat: 56, color: '#EAB308', orderId: 'TX-5204', timeWindow: '14:30 - 16:30', eta: '14:45', paxName: 'Zulkifli Ali', demand: 1 },
      { id: 405, name: 'Cheras Flat Blok B', lng: 78, lat: 72, color: '#EAB308', orderId: 'TX-5205', timeWindow: '17:30 - 19:30', eta: '17:55', paxName: 'Grace Sze', demand: 0 },
    ]
  },
  {
    id: 'epsilon',
    name: 'Epsilon',
    driver: 'Epsilon',
    avatar: '',
    color: '#06B6D4', // Cyan
    rating: 4.88,
    status: 'Active',
    currentReward: 1950,
    avgDuration: 21.3,
    totalTrips: 310,
    stops: [
      { id: 501, name: 'Brickfields Little India', lng: 42, lat: 56, color: '#06B6D4', orderId: 'TX-4401', timeWindow: '08:30 - 10:30', eta: '08:45', paxName: 'Ravi Kumar', demand: 1 },
      { id: 502, name: 'Tun Sambanthan Monorail', lng: 46, lat: 50, color: '#06B6D4', orderId: 'TX-4402', timeWindow: '11:00 - 12:30', eta: '11:15', paxName: 'Lily Wong', demand: 0 },
      { id: 503, name: 'National Museum Plaza', lng: 35, lat: 62, color: '#06B6D4', orderId: 'TX-4403', timeWindow: '13:00 - 14:30', eta: '13:20', paxName: 'Siti Aminah', demand: 1 },
    ]
  }
];

export const INITIAL_TRIPS: Trip[] = [
  // Alpha
  {
    id: '1',
    orderId: 'TX-9051',
    driverId: 'alpha',
    driverName: 'Alpha',
    driverColor: '#3B82F6',
    pickup: 'KL Sentral Depot',
    destination: 'Bangsar Telawi / Alpha',
    timeWindow: '07:00 - 09:00',
    eta: '07:15',
    status: 'Completed',
    fare: 22.0,
    passenger: 'Ahmad Faiz',
    phone: '+60 12-321 4455',
    notes: 'Pick up near Maybank branch.',
  },
  {
    id: '2',
    orderId: 'TX-9052',
    driverId: 'alpha',
    driverName: 'Alpha',
    driverColor: '#3B82F6',
    pickup: 'Bangsar Telawi / Alpha',
    destination: 'Pusat Bandar Damansara',
    timeWindow: '09:00 - 11:30',
    eta: '09:20',
    status: 'Completed',
    fare: 18.5,
    passenger: 'Sarah Lim',
    phone: '+60 17-645 8899',
    notes: 'Dropoff at Wisma MRT.',
  },
  {
    id: '3',
    orderId: 'TX-9053',
    driverId: 'alpha',
    driverName: 'Alpha',
    driverColor: '#3B82F6',
    pickup: 'Pusat Bandar Damansara',
    destination: 'Damansara Heights West',
    timeWindow: '12:00 - 14:00',
    eta: '12:10',
    status: 'In Progress',
    fare: 15.0,
    passenger: 'John Doe',
    phone: '+60 11-2342 9012',
    notes: 'Passenger has massive luggage.',
  },
  {
    id: '4',
    orderId: 'TX-9054',
    driverId: 'alpha',
    driverName: 'Alpha',
    driverColor: '#3B82F6',
    pickup: 'Damansara Heights West',
    destination: 'Mid Valley Megamall',
    timeWindow: '15:00 - 17:00',
    eta: '15:25',
    status: 'Pending',
    fare: 31.0,
    passenger: 'Farhana Jamil',
    phone: '+60 13-445 1122',
    notes: 'Wait at south court entrance.',
  },
  {
    id: '5',
    orderId: 'TX-9055',
    driverId: 'alpha',
    driverName: 'Alpha',
    driverColor: '#3B82F6',
    pickup: 'Mid Valley Megamall',
    destination: 'Bangsar South Nexus',
    timeWindow: '18:00 - 20:00',
    eta: '18:30',
    status: 'Pending',
    fare: 19.0,
    passenger: 'Michael Tan',
    phone: '+60 19-338 7766',
    notes: 'Office rush hour pickup.',
  },

  // Beta
  {
    id: '6',
    orderId: 'TX-8831',
    driverId: 'beta',
    driverName: 'Beta',
    driverColor: '#F97316',
    pickup: 'KL Sentral Depot',
    destination: 'Sentul East Metro',
    timeWindow: '08:00 - 10:00',
    eta: '08:20',
    status: 'Completed',
    fare: 28.0,
    passenger: 'Divya Nair',
    phone: '+60 16-223 9988',
    notes: 'LRT Station underpass.',
  },
  {
    id: '7',
    orderId: 'TX-8832',
    driverId: 'beta',
    driverName: 'Beta',
    driverColor: '#F97316',
    pickup: 'Sentul East Metro',
    destination: 'Titiwangsa Lake Gardens',
    timeWindow: '10:30 - 12:00',
    eta: '10:45',
    status: 'Completed',
    fare: 14.0,
    passenger: 'Wong Siew',
    phone: '+60 12-556 1223',
    notes: 'Recreational field dropoff.',
  },
  {
    id: '8',
    orderId: 'TX-8833',
    driverId: 'beta',
    driverName: 'Beta',
    driverColor: '#F97316',
    pickup: 'Titiwangsa Lake Gardens',
    destination: 'Chow Kit Bazaar',
    timeWindow: '12:30 - 14:30',
    eta: '13:00',
    status: 'In Progress',
    fare: 20.5,
    passenger: 'Hafiz Hamdan',
    phone: '+60 14-889 4433',
    notes: 'Very congested area. Watch out for road works.',
  },
  {
    id: '9',
    orderId: 'TX-8834',
    driverId: 'beta',
    driverName: 'Beta',
    driverColor: '#F97316',
    pickup: 'Chow Kit Bazaar',
    destination: 'Kampung Baru foodcourt',
    timeWindow: '15:00 - 17:00',
    eta: '15:15',
    status: 'Pending',
    fare: 12.5,
    passenger: 'Nurul Ain',
    phone: '+60 11-1343 0088',
    notes: 'Dropoff at Nasi Lemak Wanjo.',
  },

  // Gamma
  {
    id: '10',
    orderId: 'TX-7011',
    driverId: 'gamma',
    driverName: 'Gamma',
    driverColor: '#10B981',
    pickup: 'KL Sentral Depot',
    destination: 'KLCC G-Floor Lobby',
    timeWindow: '07:30 - 09:30',
    eta: '07:50',
    status: 'Completed',
    fare: 26.0,
    passenger: 'Sofia Lee',
    phone: '+60 12-345 6789',
    notes: 'Main luxury workspace lobby entrance.',
  },
  {
    id: '11',
    orderId: 'TX-7012',
    driverId: 'gamma',
    driverName: 'Gamma',
    driverColor: '#10B981',
    pickup: 'KLCC G-Floor Lobby',
    destination: 'Pavilion Bukit Bintang',
    timeWindow: '10:00 - 12:00',
    eta: '10:20',
    status: 'Completed',
    fare: 17.0,
    passenger: 'Sanjay Kumar',
    phone: '+60 18-989 3344',
    notes: 'Dropoff near fountain side.',
  },
  {
    id: '12',
    orderId: 'TX-7014',
    driverId: 'gamma',
    driverName: 'Gamma',
    driverColor: '#10B981',
    pickup: 'Tun Razak Exchange TRX',
    destination: 'Merdeka 118 Plaza',
    timeWindow: '16:00 - 18:00',
    eta: '16:30',
    status: 'Pending',
    fare: 24.5,
    passenger: 'Ameera Latif',
    phone: '+60 13-909 2314',
    notes: 'Premium commercial building corridor.',
  },

  // Delta
  {
    id: '13',
    orderId: 'TX-5201',
    driverId: 'delta',
    driverName: 'Delta',
    driverColor: '#EAB308',
    pickup: 'KL Sentral Depot',
    destination: 'UTM KL Block G Campus',
    timeWindow: '08:00 - 09:30',
    eta: '08:15',
    status: 'Completed',
    fare: 35.0,
    passenger: 'Prof. Dr. Kamal',
    phone: '+60 12-777 5543',
    notes: 'VIP guest from Malaysia University.',
  },
  {
    id: '14',
    orderId: 'TX-5203',
    driverId: 'delta',
    driverName: 'Delta',
    driverColor: '#EAB308',
    pickup: 'Datuk Keramat LRT',
    destination: 'Ampang Point Mall',
    timeWindow: '12:00 - 13:30',
    eta: '12:20',
    status: 'In Progress',
    fare: 19.5,
    passenger: 'Daniel Harris',
    phone: '+60 19-212 9010',
    notes: 'Stop at taxi bay.',
  },
  {
    id: '15',
    orderId: 'TX-4401',
    driverId: 'epsilon',
    driverName: 'Epsilon',
    driverColor: '#06B6D4',
    pickup: 'KL Sentral Depot',
    destination: 'Brickfields Little India',
    timeWindow: '08:30 - 10:30',
    eta: '08:45',
    status: 'Completed',
    fare: 15.5,
    passenger: 'Ravi Kumar',
    phone: '+60 14-332 7700',
    notes: 'Pick up opposite temple.',
  },
  {
    id: '16',
    orderId: 'TX-4402',
    driverId: 'epsilon',
    driverName: 'Epsilon',
    driverColor: '#06B6D4',
    pickup: 'Brickfields Little India',
    destination: 'Tun Sambanthan Monorail',
    timeWindow: '11:00 - 12:30',
    eta: '11:15',
    status: 'In Progress',
    fare: 12.0,
    passenger: 'Lily Wong',
    phone: '+60 16-880 2211',
    notes: 'Passenger heading to KL Sentral.',
  },
];

// Let's generate a stunning, realistic upward training curve for Q-Learning and DQN
// Q-Learning has higher variance initially and slower convergence but converges beautifully.
// DQN starts very low, has a neural network exploration cliff, then climbs very steep and smooth to a higher reward.
export const generateTrainingHistory = (): TrainingDataPoint[] => {
  const points: TrainingDataPoint[] = [];
  const totalEpisodes = 10000;
  const samplePointsCount = 50; // Keep rendering light and performant!

  // Mathematical curves:
  // Q-Learning: -200 + 420 * (1 - e ^ (-x / 2300)) + random noise of -10 to 10
  // DQN: -250 + 450 * (1 - e ^ (-x / 1800)^1.8) + random noise of -5 to 5
  for (let i = 0; i <= samplePointsCount; i++) {
    const episode = Math.round((i / samplePointsCount) * totalEpisodes);
    const progress = episode / totalEpisodes;

    // Q-Learning Curve
    const qBase = -180 + 390 * (1 - Math.exp(-episode / 3000));
    // Decaying noise
    const qNoise = (Math.sin(episode * 0.04) * 8 + (Math.random() - 0.5) * 16) * (1 - progress * 0.8);
    const qReward = Math.round(qBase + qNoise);
    const qSteps = Math.round(90 - 68 * progress + (Math.random() - 0.5) * 6 * (1 - progress));

    // DQN Curve
    const dqnBase = -220 + 440 * (1 - Math.pow(Math.exp(-episode / 2200), 2.2));
    const dqnNoise = (Math.cos(episode * 0.05) * 5 + (Math.random() - 0.5) * 8) * (1 - progress * 0.9);
    const dqnReward = Math.round(dqnBase + dqnNoise);
    const dqnSteps = Math.round(110 - 90 * Math.pow(progress, 1.4) + (Math.random() - 0.5) * 4 * (1 - progress));

    points.push({
      episode,
      qLearningReward: qReward,
      dqnReward: dqnReward,
      qLearningSteps: Math.max(12, qSteps),
      dqnSteps: Math.max(10, dqnSteps),
    });
  }

  return points;
};
