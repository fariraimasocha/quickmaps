"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Location } from '@/lib/locations';

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Partial<Location>) => void;
  coordinates: { latitude: number; longitude: number } | null;
}

export function LocationDialog({ isOpen, onClose, onSave, coordinates }: LocationDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'shop',
    address: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coordinates) {
      onSave({
        ...formData,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
      setFormData({ name: '', type: 'shop', address: '', description: '' });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Location['type'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="fuel">Fuel Station</SelectItem>
                <SelectItem value="park">Park</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="barbershop">Barbershop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Location</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}