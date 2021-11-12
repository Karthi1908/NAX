import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import React from 'react';

export default function Loading() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      minHeight="100vh"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size="lg" />
    </Box>
  );
}
