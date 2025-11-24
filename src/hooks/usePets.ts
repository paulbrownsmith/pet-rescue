import { useState, useEffect } from 'react';
import { Pet, PetFormData } from '../types/Pet';
import { storageUtils } from '../utils/storage';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedPets = storageUtils.getPets();
    setPets(loadedPets);
    setLoading(false);
  }, []);

  const addPet = (petData: PetFormData) => {
    const newPet: Pet = {
      ...petData,
      id: `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'missing',
      createdAt: new Date().toISOString(),
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
