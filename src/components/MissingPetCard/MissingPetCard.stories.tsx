import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { fn } from 'storybook/test';
import MissingPetCard from './MissingPetCard';
import { MissingPet } from '../../types/Pet';

const meta: Meta<typeof MissingPetCard> = {
  title: 'Components/MissingPetCard',
  component: MissingPetCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    pet: {
      description: 'The pet data to display',
    },
    onMarkAsFound: {
      description: 'Callback when "Mark as Found" button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock pet data
const mockMissingPet: MissingPet = {
  id: '1',
  name: 'Buddy',
  species: 'Dog',
  breed: 'Golden Retriever',
  colour: 'Golden',
  notes: 'Friendly golden retriever, answers to Buddy. Has a red collar with a bone-shaped tag.',
  status: 'missing',
  lastSeenLocation: {
    latitude: 51.5074,
    longitude: -0.1278,
    address: '123 Park Lane, London',
  },
  lastSeenDate: '2024-11-20',
  contactInfo: {
    name: 'John Smith',
    phone: '07700 900123',
  },
  photoUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
  createdAt: '2024-11-20T10:00:00Z',
  updatedAt: '2024-11-20T10:00:00Z',
};

const mockFoundPet: MissingPet = {
  ...mockMissingPet,
  id: '2',
  name: 'Max',
  species: 'Dog',
  breed: 'Labrador',
  colour: 'Black',
  status: 'found',
};

const mockCatPet: MissingPet = {
  id: '3',
  name: 'Whiskers',
  species: 'Cat',
  breed: 'Tabby',
  colour: 'Orange and White',
  notes: 'Small tabby cat with distinctive orange stripes. Very shy.',
  status: 'missing',
  lastSeenLocation: {
    latitude: 51.5155,
    longitude: -0.0922,
    address: '456 Cat Street, London',
  },
  lastSeenDate: '2024-11-22',
  contactInfo: {
    name: 'Sarah Johnson',
    phone: '07700 900456',
  },
  photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
  createdAt: '2024-11-22T10:00:00Z',
  updatedAt: '2024-11-22T10:00:00Z',
};

export const MissingDog: Story = {
  args: {
    pet: mockMissingPet,
    onMarkAsFound: fn(),
  },
};

export const FoundDog: Story = {
  args: {
    pet: mockFoundPet,
    onMarkAsFound: fn(),
  },
};

export const MissingCat: Story = {
  args: {
    pet: mockCatPet,
    onMarkAsFound: fn(),
  },
};

export const WithoutImage: Story = {
  args: {
    pet: {
      ...mockMissingPet,
      photoUrl: '',
    },
    onMarkAsFound: fn(),
  },
};

export const LongNotes: Story = {
  args: {
    pet: {
      ...mockMissingPet,
      notes: 'This is a very friendly golden retriever who loves to play fetch and go for long walks. He was last seen in the park wearing a red collar with a bone-shaped tag. He is microchipped and answers to his name. Please contact us immediately if you see him. He may be scared and confused.',
    },
    onMarkAsFound: fn(),
  },
};
