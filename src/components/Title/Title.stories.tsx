import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Title from './Title';

const meta: Meta<typeof Title> = {
  title: 'Components/Title',
  component: Title,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The text to display in the heading',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Missing Pets',
  },
};

export const ShortTitle: Story = {
  args: {
    title: 'Pets',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Recently Found Pets in Your Area',
  },
};

export const WithEmoji: Story = {
  args: {
    title: '🐕 Report a Missing Pet 🐈',
  },
};
