// src/components/MemoryManager.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Memory,
  Delete,
  Add,
  ContactPhone,
  Money,
  Inventory,
  Note
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';

const MemoryManager = () => {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await secondBrainAPI.getMemories();
      setMemories(data.memories || []);
    } catch (error) {
      console.error('Error loading memories:', error);
    }
  };

  const handleAddMemory = async () => {
    if (!newMemory.trim()) return;

    setLoading(true);
    try {
      await secondBrainAPI.addMemory(newMemory);
      setNewMemory('');
      await loadMemories();
    } catch (error) {
      console.error('Error adding memory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemory = async (memoryKey) => {
    try {
      await secondBrainAPI.deleteMemory(memoryKey);
      await loadMemories();
      setDeleteDialog(null);
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const getMemoryIcon = (category) => {
    switch (category) {
      case 'contacts':
        return <ContactPhone />;
      case 'financial':
        return <Money />;
      case 'borrowed_items':
        return <Inventory />;
      default:
        return <Note />;
    }
  };

  const getMemoryColor = (category) => {
    switch (category) {
      case 'contacts':
        return 'primary';
      case 'financial':
        return 'success';
      case 'borrowed_items':
        return 'warning';
      default:
        return 'default';
    }
  };

  const groupedMemories = memories.reduce((acc, memory) => {
    const category = memory.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(memory);
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Memory Management
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Memory
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Use natural language to add memories. Examples:
          "memorize my phone number as 1234567890", 
          "remember this John owes me 5000 rupees",
          "store this tulasi's phone number as 7278949280"
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter memory command..."
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddMemory();
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddMemory}
            disabled={loading || !newMemory.trim()}
          >
            Add
          </Button>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stored Memories ({memories.length})
        </Typography>

        {Object.keys(groupedMemories).length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No memories stored yet. Add some using the form above.
          </Typography>
        ) : (
          Object.entries(groupedMemories).map(([category, categoryMemories]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {getMemoryIcon(category)}
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {category.replace('_', ' ')} ({categoryMemories.length})
                </Typography>
              </Box>
              
              <List>
                {categoryMemories.map((memory, index) => (
                  <React.Fragment key={memory.original_key}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => setDeleteDialog(memory.original_key)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Memory color={getMemoryColor(category)} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1">
                              {memory.original_key.replace(/_/g, ' ')}
                            </Typography>
                            <Chip
                              label={category}
                              size="small"
                              color={getMemoryColor(category)}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondaryTypographyProps={{ component: "div" }}
                        secondary={
                          <Box>
                            <Typography variant="body1">
                              {memory.memory.value}
                            </Typography>
                            {memory.memory.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {memory.memory.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < categoryMemories.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          ))
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
      >
        <DialogTitle>Delete Memory</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this memory? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteMemory(deleteDialog)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemoryManager;