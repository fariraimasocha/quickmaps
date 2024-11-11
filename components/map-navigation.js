"use client";

import { useState } from 'react';
import { Search, Navigation2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function MapNavigation({ className, locations, onLocationSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("border-l bg-background p-4 flex flex-col", className)}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Harare Locations</h2>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 mt-4 -mx-4 px-4">
        <div className="space-y-2">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
              onClick={() => onLocationSelect?.(location)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Added: {format(new Date(location.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button variant="ghost" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Navigation2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}