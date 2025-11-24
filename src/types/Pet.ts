export interface MissingPet {
  id: string; // unique identifier (UUID or timestamp)
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  colour: string;
  photoUrl: string;
  lastSeenLocation: {
    latitude: number;
    longitude: number;
    address?: string; // optional text description
  };
  lastSeenDate: string; // ISO 8601 format
  contactInfo: {
    name: string;
    phone: string;
  };
  notes?: string;
  status: 'missing' | 'found';
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export interface PetFormData {
  name: string;
  type: string;
  breed: string;
  colour: string;
  lastSeenLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  lastSeenDate: string;
  description: string;
  photoUrl?: string;
  notes?: string;
  contactInfo: {
    name: string;
    phone: string;
  };
}

export interface PetJSON {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  primaryColour: string;
  secondaryColour?: string;
  photoUrl: string;
  lastSeenLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  lastSeenDate: string;
  contactInfo: {
    name: string;
    phone: string;
  };
  notes?: string;
  status: 'missing' | 'found';
  createdAt: string;
  updatedAt?: string;
}