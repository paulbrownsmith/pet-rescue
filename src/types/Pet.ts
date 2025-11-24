export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  lastSeenLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  lastSeenDate: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  imageUrl?: string;
  status: 'missing' | 'found';
  createdAt: string;
}

export interface PetFormData {
  name: string;
  type: string;
  breed: string;
  color: string;
  lastSeenLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  lastSeenDate: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}
