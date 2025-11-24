import { Pet } from '../types/Pet';

const STORAGE_KEY = 'pet-rescue-data';

export const storageUtils = {
  getPets: (): Pet[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  savePets: (pets: Pet[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  addPet: (pet: Pet): void => {
    const pets = storageUtils.getPets();
    pets.push(pet);
    storageUtils.savePets(pets);
  },

  updatePet: (id: string, updatedPet: Partial<Pet>): void => {
    const pets = storageUtils.getPets();
    const index = pets.findIndex((pet) => pet.id === id);
    if (index !== -1) {
      pets[index] = { ...pets[index], ...updatedPet };
      storageUtils.savePets(pets);
    }
  },

  deletePet: (id: string): void => {
    const pets = storageUtils.getPets();
    const filteredPets = pets.filter((pet) => pet.id !== id);
    storageUtils.savePets(filteredPets);
  },
};
