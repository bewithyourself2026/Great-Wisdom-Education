import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Box>
        <Typography variant="body1">
          This page will show the user's dashboard with their enrollments, progress, upcoming sessions, and other personalized information.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;