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
  Tooltip
} from '@mui/material';
import {
  // Psychology as BrainIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout, isMobile }) {
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
            
            <Tooltip title="Account menu">
              <IconButton
                onClick={handleMenu}
                color="inherit"
                size="small"
              >
                <AccountIcon />
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