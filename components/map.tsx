"use client";

import { useCallback, useRef, useState } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Location, defaultLocations } from '@/lib/locations';
import { LocationDialog } from './location-dialog';
import { LocationDetails } from './location-details';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZm1hc29jaGEiLCJhIjoiY2x3OTJxeTRqMmM1czJrbXFqd25iNXh4ciJ9.9H7GjG6i8e7QpqTRIratuw';

// Harare coordinates
const HARARE_COORDINATES = {
  latitude: -17.8292,
  longitude: 31.0522,
  zoom: 12
};

interface MapComponentProps {
  onLocationAdd?: (location: Location) => void;
  locations: Location[];
}

export default function MapComponent({ onLocationAdd, locations = defaultLocations }: MapComponentProps) {
  const mapRef = useRef(null);
  const { toast } = useToast();
  const [viewState, setViewState] = useState(HARARE_COORDINATES);
  const [newMarker, setNewMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [directions, setDirections] = useState<any>(null);

  const handleMapClick = useCallback((event) => {
    const { lngLat } = event;
    setNewMarker({
      longitude: lngLat.lng,
      latitude: lngLat.lat
    });
    setShowAddDialog(true);
  }, []);

  const handleAddLocation = (locationData: Partial<Location>) => {
    if (onLocationAdd && newMarker) {
      const newLocation: Location = {
        id: `${Date.now()}`,
        name: locationData.name || '',
        type: locationData.type || 'shop',
        address: locationData.address || '',
        description: locationData.description,
        latitude: newMarker.latitude,
        longitude: newMarker.longitude,
        createdAt: new Date().toISOString()
      };
      onLocationAdd(newLocation);
      setNewMarker(null);
      toast({
        title: "Location Added",
        description: `${newLocation.name} has been added to your locations.`,
      });
    }
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);
  };

  const getDirections = async (location: Location) => {
    try {
      // Get user's current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const start = `${position.coords.longitude},${position.coords.latitude}`;
      const end = `${location.longitude},${location.latitude}`;
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        setDirections({
          type: 'Feature',
          properties: {},
          geometry: data.routes[0].geometry
        });
        
        // Fit map to show the entire route
        const map = mapRef.current?.getMap();
        if (map) {
          const coordinates = data.routes[0].geometry.coordinates;
          const bounds = coordinates.reduce((bounds: any, coord: number[]) => {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          map.fitBounds(bounds, {
            padding: 50
          });
        }

        toast({
          title: "Directions Loaded",
          description: `Distance: ${(data.routes[0].distance / 1000).toFixed(2)} km`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load directions. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(location);
            }}
          >
            <MapPin className="h-6 w-6 text-primary hover:text-primary/80 transition-colors cursor-pointer" />
          </Marker>
        ))}

        {directions && (
          <Source type="geojson" data={directions}>
            <Layer
              id="route"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 4,
                'line-opacity': 0.75
              }}
            />
          </Source>
        )}
      </Map>

      <div className="absolute bottom-4 left-4 z-10 space-x-2">
        <Button
          variant="secondary"
          onClick={() => {
            setNewMarker(null);
            setViewState(HARARE_COORDINATES);
            setDirections(null);
          }}
          className="shadow-lg"
        >
          Reset View
        </Button>
        {directions && (
          <Button
            variant="secondary"
            onClick={() => setDirections(null)}
            className="shadow-lg"
          >
            Clear Directions
          </Button>
        )}
      </div>

      <LocationDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setNewMarker(null);
        }}
        onSave={handleAddLocation}
        coordinates={newMarker}
      />

      <LocationDetails
        location={selectedLocation}
        isOpen={showLocationDetails}
        onClose={() => {
          setShowLocationDetails(false);
          setSelectedLocation(null);
        }}
        onGetDirections={getDirections}
      />
    </>
  );
}