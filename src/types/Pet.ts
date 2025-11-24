// Base pet information shared across all pet-related interfaces
interface BasePetInfo {
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  notes?: string;
}

// Base contact information
interface ContactInfo {
  name: string;
  phone: string;
}

// Location information for stored pets
interface StoredLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

// Location information for form data
interface FormLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface MissingPet extends BasePetInfo {
  id: string; // unique identifier (UUID or timestamp)
  colour: string;
  photoUrl: string;
  lastSeenLocation: StoredLocation;
  lastSeenDate: string; // ISO 8601 format
  contactInfo: ContactInfo;
  status: 'missing' | 'found';
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export interface PetFormData extends BasePetInfo {
  type: string;
  colour: string;
  lastSeenLocation: FormLocation;
  lastSeenDate: string;
  description: string;
  photoUrl?: string;
  contactInfo: ContactInfo;
}

export interface PetJSON extends BasePetInfo {
  id: string;
  primaryColour: string;
  secondaryColour?: string;
  photoUrl: string;
  lastSeenLocation: StoredLocation & { address: string }; // address is required in JSON
  lastSeenDate: string;
  contactInfo: ContactInfo;
  status: 'missing' | 'found';
  createdAt: string;
  updatedAt?: string;
}