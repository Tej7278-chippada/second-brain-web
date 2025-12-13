// src/components/MemoryManager.js
import React, { useState, useEffect, useCallback } from 'react';
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
  DialogActions,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  // CardActions,
  Fade,
  // Tooltip,
  InputAdornment,
  CircularProgress,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Memory,
  Delete,
  Add,
  ContactPhone,
  Money,
  Inventory,
  Note,
  Search,
  // Category,
  // Timer,
  // AccountBalance,
  // Email,
  // Phone,
  Person,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Refresh
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const MemoryManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('all');
  const [stats, setStats] = useState({ total: 0, byCategory: {} });

  

  const loadMemories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await secondBrainAPI.getMemories();
      setMemories(data.memories || []);
      calculateStats(data.memories || []);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const calculateStats = (memoriesList) => {
    const stats = {
      total: memoriesList.length,
      byCategory: {}
    };

    memoriesList.forEach(memory => {
      const category = memory.category;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    setStats(stats);
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
        return <ContactPhone color="primary" />;
      case 'financial':
        return <Money color="success" />;
      case 'borrowed_items':
        return <Inventory color="warning" />;
      case 'important_notes':
        return <Note color="info" />;
      case 'personal_info':
        return <Person color="secondary" />;
      default:
        return <Memory />;
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
      case 'important_notes':
        return 'info';
      case 'personal_info':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.original_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.memory.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || memory.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const groupedMemories = filteredMemories.reduce((acc, memory) => {
    const category = memory.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(memory);
    return acc;
  }, {});

  const categoryTabs = [
    { value: 'all', label: 'All', count: stats.total },
    ...Object.entries(stats.byCategory).map(([category, count]) => ({
      value: category,
      label: category.replace('_', ' ').toUpperCase(),
      count
    }))
  ];

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const quickAddExamples = [
    { text: "memorize my phone number as 1234567890", category: "personal_info" },
    { text: "remember John owes me 5000 rupees", category: "financial" },
    { text: "store tulasi's phone number as 7278949280", category: "contacts" },
    { text: "I borrowed charger from Rashmi", category: "borrowed_items" }
  ];

  return (
    <Box>
      {/* Header with Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
            Memory Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Store and recall personal information, contacts, debts, and reminders
          </Typography>
        </Box>
        <Chip 
          icon={<Memory />}
          label={`${stats.total} memories`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Add Memory Section */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add New Memory
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Use natural language to add memories. Examples:
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickAddExamples.map((example, index) => (
              <Chip
                key={index}
                label={example.text}
                size="small"
                onClick={() => setNewMemory(example.text)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 1, flexDirection: isMobile ? 'column' : 'row' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter memory command..."
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddMemory();
              }
            }}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Memory />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddMemory}
            disabled={loading || !newMemory.trim()}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(stats.byCategory).slice(0, 4).map(([category, count]) => (
          <Grid item xs={6} md={3} key={category}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  {getMemoryIcon(category)}
                </Box>
                <Typography variant="h5">{count}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.replace('_', ' ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filter */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            onClick={loadMemories}
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categoryTabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <Chip
                      label={tab.count}
                      size="small"
                      sx={{ height: 20, minWidth: 20 }}
                    />
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Memories List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredMemories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Memory sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No memories found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try a different search term' : 'Add your first memory using the form above'}
          </Typography>
        </Paper>
      ) : (
        Object.entries(groupedMemories).map(([category, categoryMemories]) => (
          <Fade in key={category}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => setExpandedCategory(expandedCategory === category ? 'all' : category)}
              >
                {getMemoryIcon(category)}
                <Typography variant="h6" sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
                  {category.replace('_', ' ')} ({categoryMemories.length})
                </Typography>
                {expandedCategory === category ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </Box>
              
              <Collapse in={expandedCategory === category}> {/* expandedCategory === 'all' || */}
                <List>
                  {categoryMemories.map((memory, index) => (
                    <React.Fragment key={memory.original_key}>
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => setDeleteDialog(memory.original_key)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          {getMemoryIcon(category)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {memory.original_key.replace(/_/g, ' ')}
                              </Typography>
                              <Chip
                                label={category}
                                size="small"
                                color={getMemoryColor(category)}
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                {formatDate(memory.memory.created_at)}
                              </Typography>
                            </Box>
                          }
                          secondaryTypographyProps={{ component: "div" }}
                          secondary={
                            <Box>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {memory.memory.value}
                              </Typography>
                              {memory.memory.description && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Info fontSize="small" color="action" />
                                  <Typography variant="body2" color="text.secondary">
                                    {memory.memory.description}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < categoryMemories.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Collapse>
            </Paper>
          </Fade>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Memory</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The memory will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete this memory?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteMemory(deleteDialog)} 
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemoryManager;