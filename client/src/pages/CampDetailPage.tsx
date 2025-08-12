import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CampDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Camp Details
      </Typography>
      <Box>
        <Typography variant="body1">
          This page will show detailed information about a specific camp, including curriculum, instructor details, reviews, and enrollment options.
        </Typography>
      </Box>
    </Container>
  );
};

export default CampDetailPage;