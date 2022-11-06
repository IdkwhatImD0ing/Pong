import {Box} from '@mui/material';
import React from 'react';
import PongComponent from './Pong';

export default function Game() {
  return (
    <Box height="100vh" width="100vw" sx={{bgcolor: '#5A5A5A'}}>
      <PongComponent />
    </Box>
  );
}
