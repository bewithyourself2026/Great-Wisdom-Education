import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const InstructorDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Instructor Profile
      </Typography>
      <Box>
        <Typography variant="body1">
          This page will show detailed information about a specific instructor, including their background, expertise, and available camps.
        </Typography>
      </Box>
    </Container>
  );
};

export default InstructorDetailPage;