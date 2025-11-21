// src/components/Header.js
import React from 'react';
import {
  AppBar,
  // Toolbar,
  Typography,
  Box,
  // Chip,
  // IconButton,
  // Tooltip
} from '@mui/material';
// import {
//   Psychology as BrainIcon,
//   GitHub as GitHubIcon,
//   Settings as SettingsIcon
// } from '@mui/icons-material';

function Header({isMobile}) {
  return (
    <AppBar position="sticky" elevation={2}>
      <Box sx={{padding: isMobile ? '4px 8px' : '4px 12px', display: 'flex', alignItems: 'center' }}>
        {/* <BrainIcon sx={{ mr: 2, fontSize: 32 }} /> */}
        <img 
          src="/logo/logo1.svg" 
          alt="Second Brain Logo" 
          style={{ 
            width: isMobile ? 40 : 50, 
            height: isMobile ? 40 : 50,
            marginRight: 4 
          }} 
        />
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h1" fontWeight="bold">
            Second Brain
          </Typography>
          <Typography variant="caption" component="h1" color="text.secondary">
            Your AI-powered personal knowledge assistant
          </Typography>
        </Box>
        
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label="AI Ready" 
            color="success" 
            variant="outlined"
            size="small"
          />
          
          <Tooltip title="Settings">
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="GitHub">
            <IconButton color="inherit">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box> */}
      </Box>
    </AppBar>
  );
}

export default Header;