import { Typography } from '@mui/material';
import React from 'react';

interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }) => {
  return <Typography variant="h5" component="h2" sx={{ mb: 2 }}>{title}</Typography>;
};

export default Title;
