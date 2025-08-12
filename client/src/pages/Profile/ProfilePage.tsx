import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Profile
      </Typography>
      <Box>
        <Typography variant="body1">
          This page will allow users to view and edit their profile information, preferences, and account settings.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;