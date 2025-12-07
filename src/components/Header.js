// src/components/Header.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  // Avatar,
  IconButton,
  Menu,
  MenuItem,
  // Chip,
  Tooltip,
  Avatar,
  // Chip
} from '@mui/material';
import {
  // Psychology as BrainIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout, isMobile, darkMode }) {
  // const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const handleProfile = () => {
    handleClose();
    // Navigate to profile page if you create one
    // navigate('/profile');
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ padding: isMobile ? '4px 8px' : '4px 16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* <BrainIcon sx={{ mr: 2, fontSize: isMobile ? 28 : 32 }} /> */}
        <img 
          src="/logo/logo1.svg" 
          alt="Second Brain Logo" 
          style={{ 
            width: isMobile ? 30 : 40, 
            height: isMobile ? 30 : 40,
            marginRight: 4 
          }} 
        />
          <Box>
            <Typography variant="h6" component="h1" fontWeight="bold" noWrap>
              Second Brain
            </Typography>
            <Typography variant="caption" component="h1" color="text.secondary" noWrap>
              Your AI-powered personal knowledge assistant
            </Typography>
          </Box>
        </Box>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* <Chip 
              label={user.username}
              variant="outlined"
              size="small"
              avatar={
                <Avatar 
                  src={user.profile_pic} 
                  alt={user.username}
                  sx={{ width: 24, height: 24 }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
              }
            /> */}
            
            <Tooltip title="Account menu" arrow>
              <IconButton
                onClick={handleMenu}
                color="inherit"
                size="small"
                sx={{
                  p: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                {/* <AccountIcon /> */}
                <Avatar
                  src={
                    user.profile_pic === null
                      ? 'https://placehold.co/56x56?text=No+Image'
                      : user.profile_pic
                  }
                  sx={{
                    width: 40,
                    height: 40,
                    border: darkMode ? '3px solid rgba(168, 168, 168, 0.8)' : '3px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {user.username[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 180
                }
              }}
            >
              {/* User Info Header */}
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)'}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#4361ee' }}>
                  Welcome back!
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)' }}>
                  {user.username}
                </Typography>
              </Box>
              <MenuItem onClick={handleProfile}>
                <AccountIcon sx={{ mr: 1 }} fontSize="small" />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;