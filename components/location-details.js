"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Navigation2 } from "lucide-react";

export function LocationDetails({
  location,
  isOpen,
  onClose,
  onGetDirections,
}) {
  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{location.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Address</h4>
            <p className="text-sm text-muted-foreground">{location.address}</p>
          </div>
          {location.description && (
            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">{location.description}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium">Type</h4>
            <p className="text-sm text-muted-foreground capitalize">{location.type}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Coordinates</h4>
            <p className="text-sm text-muted-foreground">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => onGetDirections(location)}
          >
            <Navigation2 className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}