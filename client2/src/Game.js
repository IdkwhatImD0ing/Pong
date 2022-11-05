import {Box} from '@mui/material';
import React from 'react';
import PongComponent from './Single/Pong';

export default function Game() {
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <PongComponent />
    </Box>
  );
}
