"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MapNavigation } from '@/components/map-navigation';
import { defaultLocations } from '@/lib/locations';

const MapComponent = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-secondary">
      <div className="animate-pulse text-lg">Loading Harare Map...</div>
    </div>
  ),
});

export default function Home() {
  const [locations, setLocations] = useState(defaultLocations);

  const handleAddLocation = (location) => {
    setLocations(prev => [...prev, location]);
  };

  const handleLocationSelect = (location) => {
    console.log('Selected location:', location);
  };

  return (
    <main className="flex h-screen">
      <div className="w-3/4 h-full relative">
        <MapComponent 
          locations={locations}
          onLocationAdd={handleAddLocation}
        />
      </div>
      <MapNavigation 
        className="w-1/4 h-full"
        locations={locations}
        onLocationSelect={handleLocationSelect}
      />
    </main>
  );
}