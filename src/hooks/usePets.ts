import { useState, useEffect } from 'react';
import { Pet, PetFormData } from '../types/Pet';
import { storageUtils } from '../utils/storage';
import petData from '../data/petData.json';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedPets = storageUtils.getPets();
    
    // If no pets in storage, use the data from petData.json
    if (loadedPets.length === 0) {
      const formattedPets: Pet[] = petData.map((pet: any) => ({
        id: pet.id,
        iid: pet.iid || pet.id,
        name: pet.name,
        species: pet.species,
        type: pet.species,
        breed: pet.breed,
        colour: pet.primaryColour,
        color: pet.primaryColour + (pet.secondaryColour ? ` and ${pet.secondaryColour}` : ''),
        lastSeenLocation: {
          latitude: pet.lastSeenLocation.latitude,
          longitude: pet.lastSeenLocation.longitude,
          address: pet.lastSeenLocation.address,
        },
        lastSeenDate: pet.lastSeenDate,
        // description: pet.notes,
        contactInfo: {
          name: pet.contactInfo.name,
          phone: pet.contactInfo.phone,
          email: pet.contactInfo.email,
        },
        photoUrl: pet.photoUrl,
        imageUrl: pet.photoUrl,
        status: pet.status as 'missing' | 'found',
        createdAt: pet.createdAt,
        updatedAt: pet.updatedAt || pet.createdAt,
      }));
      
      // Save the formatted pets to storage
      formattedPets.forEach(pet => storageUtils.addPet(pet));
      setPets(formattedPets);
    } else {
      setPets(loadedPets);
    }
    
    setLoading(false);
  }, []);

  const addPet = (petData: PetFormData) => {
    const newPet: Pet = {
      ...petData,
      id: `pet-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      species: petData.type as 'Dog' | 'Cat' | 'Other',
      colour: petData.color,
      photoUrl: petData.photoUrl || '',
      lastSeenLocation: {
        latitude: petData.lastSeenLocation.lat,
        longitude: petData.lastSeenLocation.lng,
        address: petData.lastSeenLocation.address,
      },
      contactInfo: {
        name: petData.contactInfo.name,
        phone: petData.contactInfo.phone,
      },
      status: 'missing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storageUtils.addPet(newPet);
    setPets([...pets, newPet]);
    return newPet;
  };

  const updatePet = (id: string, updatedData: Partial<Pet>) => {
    storageUtils.updatePet(id, updatedData);
    setPets(pets.map((pet) => (pet.id === id ? { ...pet, ...updatedData } : pet)));
  };

  const deletePet = (id: string) => {
    storageUtils.deletePet(id);
    setPets(pets.filter((pet) => pet.id !== id));
  };

  const markAsFound = (id: string) => {
    updatePet(id, { status: 'found' });
  };

  return {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    markAsFound,
  };
};
