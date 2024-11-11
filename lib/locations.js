// Harare's popular locations as initial data
export const defaultLocations = [
  {
    id: '1',
    name: "Sam Levy's Village",
    type: 'shop',
    address: "Borrowdale Road, Borrowdale",
    description: "Premier shopping center featuring various retail stores, restaurants, and entertainment venues.",
    latitude: -17.7817,
    longitude: 31.0754,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: "Total Energies Borrowdale",
    type: 'fuel',
    address: "Borrowdale Road",
    description: "24/7 fuel station with convenience store and car wash services.",
    latitude: -17.7789,
    longitude: 31.0772,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: "National Botanical Gardens",
    type: 'park',
    address: "Alexandra Drive, Alexandra Park",
    description: "Peaceful gardens featuring indigenous plants, walking trails, and picnic areas.",
    latitude: -17.8019,
    longitude: 31.0522,
    createdAt: new Date().toISOString()
  }
];