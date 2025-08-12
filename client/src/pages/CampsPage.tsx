import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Rating,
  CircularProgress,
} from '@mui/material';
import { School, Star, People, Schedule } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CampsPage: React.FC = () => {
  // Mock data for demonstration
  const mockCamps = [
    {
      id: '1',
      title: 'Advanced JavaScript Programming',
      description: 'Master modern JavaScript concepts including ES6+, async programming, and advanced patterns.',
      instructor: {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        avatar: 'SJ',
      },
      category: 'technology',
      level: 'advanced',
      price: 150,
      rating: 4.8,
      students: 24,
      startDate: '2024-02-15',
      coverImage: 'https://via.placeholder.com/400x250/1976d2/ffffff?text=JavaScript',
    },
    {
      id: '2',
      title: 'English Conversation Skills',
      description: 'Improve your English speaking and listening skills with native speakers.',
      instructor: {
        firstName: 'Emma',
        lastName: 'Rodriguez',
        avatar: 'ER',
      },
      category: 'language',
      level: 'intermediate',
      price: 80,
      rating: 4.9,
      students: 18,
      startDate: '2024-02-20',
      coverImage: 'https://via.placeholder.com/400x250/2e7d32/ffffff?text=English',
    },
    {
      id: '3',
      title: 'Business Leadership & Strategy',
      description: 'Learn leadership principles and strategic thinking from industry experts.',
      instructor: {
        firstName: 'Michael',
        lastName: 'Chen',
        avatar: 'MC',
      },
      category: 'business',
      level: 'advanced',
      price: 200,
      rating: 4.7,
      students: 15,
      startDate: '2024-03-01',
      coverImage: 'https://via.placeholder.com/400x250/ed6c02/ffffff?text=Leadership',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technology: '#1976d2',
      language: '#2e7d32',
      business: '#ed6c02',
      academic: '#9c27b0',
      arts: '#7b1fa2',
      sports: '#d32f2f',
    };
    return colors[category] || '#666';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Explore Educational Camps
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Discover amazing learning opportunities with expert instructors from around the world
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {mockCamps.map((camp, index) => (
            <Grid item xs={12} md={4} key={camp.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={camp.coverImage}
                    alt={camp.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={camp.category.charAt(0).toUpperCase() + camp.category.slice(1)}
                        size="small"
                        sx={{
                          bgcolor: `${getCategoryColor(camp.category)}15`,
                          color: getCategoryColor(camp.category),
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={camp.level}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {camp.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {camp.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem',
                        }}
                      >
                        {camp.instructor.avatar}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {camp.instructor.firstName} {camp.instructor.lastName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={camp.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                        {camp.rating}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {camp.students}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${camp.price}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Starts {new Date(camp.startDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      component={Link}
                      to={`/camps/${camp.id}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" sx={{ mt: 6 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Can't find what you're looking for?
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            size="large"
            startIcon={<School />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.main',
                color: 'white',
              },
            }}
          >
            Become an Instructor
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default CampsPage;