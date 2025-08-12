import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const InstructorsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Our Instructors
      </Typography>
      <Box>
        <Typography variant="body1">
          This page will showcase all instructors with their profiles, expertise, and available camps.
        </Typography>
      </Box>
    </Container>
  );
};

export default InstructorsPage;