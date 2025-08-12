import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School,
  Dashboard,
  Person,
  Logout,
  Login,
  PersonAdd,
  Search,
  Notifications,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Camps', path: '/camps' },
    { label: 'Instructors', path: '/instructors' },
  ];

  const userMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Profile', path: '/profile', icon: <Person /> },
  ];

  const renderNavItems = () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          color="inherit"
          sx={{
            textTransform: 'none',
            fontWeight: location.pathname === item.path ? 600 : 400,
            borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const renderAuthButtons = () => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        component={Link}
        to="/login"
        color="inherit"
        startIcon={<Login />}
        sx={{ textTransform: 'none' }}
      >
        Login
      </Button>
      <Button
        component={Link}
        to="/register"
        variant="contained"
        color="secondary"
        startIcon={<PersonAdd />}
        sx={{ textTransform: 'none' }}
      >
        Sign Up
      </Button>
    </Box>
  );

  const renderUserMenu = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton color="inherit">
        <Search />
      </IconButton>
      <IconButton color="inherit">
        <Notifications />
      </IconButton>
      <IconButton
        onClick={handleUserMenuOpen}
        sx={{ p: 0 }}
      >
        <Avatar
          sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
        >
          {user?.firstName?.charAt(0) || 'U'}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleUserMenuClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          {isAuthenticated && userMenuItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          {isAuthenticated ? (
            <ListItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <>
              <ListItem component={Link} to="/login" onClick={() => setMobileMenuOpen(false)}>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem component={Link} to="/register" onClick={() => setMobileMenuOpen(false)}>
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            mr: 4,
          }}
        >
          <School sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Great Wisdom Education
          </Typography>
        </Box>

        {!isMobile && renderNavItems()}

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? renderUserMenu() : renderAuthButtons()}
          </Box>
        )}

        {renderMobileMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Header;