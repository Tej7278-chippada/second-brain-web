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
  // Grid,
  // Card,
  // CardContent,
  // CardActions,
  Fade,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Collapse,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  // Badge,
  // LinearProgress,
  Switch,
  FormControlLabel,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  // AccordionActions
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
  Refresh,
  AccessTime,
  // Event,
  CheckCircle,
  Warning,
  // Timer,
  CalendarToday,
  ExpandMore,
  // MoreVert,
  Notifications,
  FilterList,
  Sort,
  Schedule,
  Alarm,
  // Today,
  // Update
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';
import { formatDistanceToNow, format, isAfter, isBefore, parseISO } from 'date-fns';

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
  const [timeStats, setTimeStats] = useState(null);
  const [upcomingMemories, setUpcomingMemories] = useState([]);
  const [expiredMemories, setExpiredMemories] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState('created');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'upcoming', 'expired', 'completed', 'all'
  // const [memoryMenuAnchor, setMemoryMenuAnchor] = useState(null);
  // const [selectedMemory, setSelectedMemory] = useState(null);

  const loadMemories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await secondBrainAPI.getMemories();
      setMemories(data.memories || []);
      calculateStats(data.memories || []);
      
      // Load time-based stats
      const timeData = await secondBrainAPI.getMemoryTimeStats();
      setTimeStats(timeData);
      
      // Load upcoming memories
      const upcomingData = await secondBrainAPI.getUpcomingMemories(168); // 1 week
      setUpcomingMemories(upcomingData.upcoming || []);
      
      // Load expired memories
      const expiredData = await secondBrainAPI.getExpiredMemories();
      setExpiredMemories(expiredData.expired || []);
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
      byCategory: {},
      timedCount: 0,
      completedCount: 0,
      upcomingCount: 0,
      expiredCount: 0
    };

    memoriesList.forEach(memory => {
      const category = memory.category;
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      
      // Time-based stats
      if (memory.memory.is_timed) {
        stats.timedCount++;
        if (memory.memory.is_completed) {
          stats.completedCount++;
        } else if (memory.memory.event_time) {
          const eventTime = parseISO(memory.memory.event_time);
          if (isBefore(eventTime, new Date())) {
            stats.expiredCount++;
          } else {
            stats.upcomingCount++;
          }
        }
      }
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

  const handleCompleteMemory = async (memoryKey, category) => {
    try {
      await secondBrainAPI.completeMemory(memoryKey, category);
      await loadMemories();
    } catch (error) {
      console.error('Error completing memory:', error);
    }
  };

  const handleCleanupMemories = async () => {
    try {
      await secondBrainAPI.cleanupMemories(30);
      await loadMemories();
    } catch (error) {
      console.error('Error cleaning up memories:', error);
    }
  };

  const getMemoryIcon = (category, isTimed = false) => {
    if (isTimed) {
      return <AccessTime color="primary" />;
    }
    
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

  const getMemoryColor = (category, isTimed = false) => {
    if (isTimed) {
      return 'primary';
    }
    
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

  const getMemoryStatus = (memory) => {
    if (memory.memory.is_completed) {
      return { label: 'Completed', color: 'success', icon: <CheckCircle /> };
    }
    
    if (memory.memory.is_timed && memory.memory.event_time) {
      const eventTime = parseISO(memory.memory.event_time);
      const now = new Date();
      
      if (isBefore(eventTime, now)) {
        return { label: 'Expired', color: 'error', icon: <Warning /> };
      }
      
      const hoursUntil = (eventTime - now) / (1000 * 60 * 60);
      if (hoursUntil <= 24) {
        return { label: 'Soon', color: 'warning', icon: <Alarm /> };
      }
      
      return { label: 'Upcoming', color: 'info', icon: <Schedule /> };
    }
    
    return { label: 'Active', color: 'default', icon: <Memory /> };
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.original_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.memory.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || memory.category === activeTab;
    const matchesTimeFilter = (() => {
      switch (timeFilter) {
        case 'upcoming':
          return memory.memory.is_timed && 
                 !memory.memory.is_completed && 
                 memory.memory.event_time && 
                 isAfter(parseISO(memory.memory.event_time), new Date());
        case 'expired':
          return memory.memory.is_timed && 
                 !memory.memory.is_completed && 
                 memory.memory.event_time && 
                 isBefore(parseISO(memory.memory.event_time), new Date());
        case 'completed':
          return memory.memory.is_completed;
        case 'timed':
          return memory.memory.is_timed;
        default:
          return showCompleted || !memory.memory.is_completed;
      }
    })();
    
    return matchesSearch && matchesCategory && matchesTimeFilter;
  });

  const sortedMemories = [...filteredMemories].sort((a, b) => {
    switch (sortBy) {
      case 'created':
        return new Date(b.memory.created_at) - new Date(a.memory.created_at);
      case 'event':
        if (a.memory.event_time && b.memory.event_time) {
          return parseISO(a.memory.event_time) - parseISO(b.memory.event_time);
        }
        return (a.memory.event_time ? -1 : (b.memory.event_time ? 1 : 0));
      case 'category':
        return a.category.localeCompare(b.category);
      case 'status':
        const statusA = getMemoryStatus(a).label;
        const statusB = getMemoryStatus(b).label;
        return statusA.localeCompare(statusB);
      default:
        return 0;
    }
  });

  const groupedMemories = sortedMemories.reduce((acc, memory) => {
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

  const formatEventTime = (dateString) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy • h:mm a');
  };

  const getTimeUntilEvent = (dateString) => {
    if (!dateString) return null;
    const eventTime = parseISO(dateString);
    const now = new Date();
    
    if (isBefore(eventTime, now)) {
      return 'Past due';
    }
    
    const diffMs = eventTime - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'in less than an hour';
    }
  };

  const quickAddExamples = [
    { text: "memorize my phone number as 1234567890", category: "personal_info" },
    { text: "remember this Arjun owes me 5000 rupees", category: "financial" },
    { text: "memorize Abhi phone number as 9876543210", category: "contacts" },
    { text: "store this I borrowed charger from Rashmi", category: "borrowed_items" },
    { text: "remember this I have meeting with Arjun tomorrow at 11AM", category: "important_notes" },
    { text: "memorize that I have dentist appointment on Friday at 2 PM", category: "important_notes" },
    { text: "remember this to call client on Monday at 10 AM", category: "important_notes" }
  ];

  const renderTimeBasedMemory = (memory) => {
    const status = getMemoryStatus(memory);
    const eventTime = memory.memory.event_time;
    
    return (
      <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {status.icon}
          <Chip
            label={status.label}
            size="small"
            color={status.color}
            variant="outlined"
          />
          {memory.memory.reminder_time && (
            <Tooltip title={`Reminder set for ${formatEventTime(memory.memory.reminder_time)}`}>
              <Notifications fontSize="small" color="action" />
            </Tooltip>
          )}
        </Box>
        
        {eventTime && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Event:</strong> {formatEventTime(eventTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({getTimeUntilEvent(eventTime)})
            </Typography>
          </Box>
        )}
        
        {memory.memory.is_completed && memory.memory.completed_at && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <CheckCircle fontSize="small" color="success" />
            <Typography variant="caption" color="text.secondary">
              Completed {formatDate(memory.memory.completed_at)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderUpcomingPanel = () => (
    <Accordion defaultExpanded sx={{ mb: 3 }}> 
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Alarm color="warning" />
          <Typography variant="h6">Upcoming Reminders</Typography>
          <Chip 
            label={upcomingMemories.length} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {upcomingMemories.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No upcoming reminders
          </Typography>
        ) : (
          <List 
            sx={{ 
              '& .MuiListItem-root': {
                px: 1
              }
            }}
          >
            {upcomingMemories.map((memory, index) => (
              <React.Fragment key={memory.key}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="Mark as completed">
                      <IconButton
                        edge="end"
                        onClick={() => handleCompleteMemory(memory.key, memory.category)}
                        size="small"
                      >
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemIcon>
                    {getMemoryIcon(memory.category, true)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {memory.memory.value}
                        </Typography>
                        <Chip
                          label={`in ${memory.memory.hours_until}h`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: '20px', }}
                        />
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatEventTime(memory.memory.event_time)}
                        </Typography>
                        {memory.memory.description && (
                          <Typography variant="caption" color="text.secondary">
                            {memory.memory.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < upcomingMemories.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderExpiredPanel = () => (
    <Accordion sx={{ mb: 3 }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <Warning color="error" />
          <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <Typography variant="body1">Past Due</Typography>
            <Typography variant="caption" color="text.secondary">
              Expired Remainders
            </Typography>
          </Box>
          <Chip 
            label={expiredMemories.length} 
            size="small" 
            color="error"
            variant="outlined"
          />
          <Box sx={{ ml: 'auto' }}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={loading || expiredMemories.length === 0}
              onClick={(e) => {
                e.stopPropagation(); // 🔥 prevents accordion toggle
                handleCleanupMemories();
              }}
            >
              Cleanup
            </Button>
          </Box>
        </Box>
      </AccordionSummary>
      {/* <AccordionActions>
        <Button
          size="small"
          variant="outlined"
          color="error"
          disabled={loading || expiredMemories.length === 0}
          onClick={handleCleanupMemories}
        >
          Cleanup
        </Button>
      </AccordionActions> */}
      <AccordionDetails>
        {expiredMemories.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No past due reminders
          </Typography>
        ) : (
          <List
            sx={{ 
              '& .MuiListItem-root': {
                px: 1
              }
            }}
          >
            {expiredMemories.map((memory, index) => (
              <React.Fragment key={memory.key}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Mark as completed">
                        <IconButton
                          edge="end"
                          onClick={() => handleCompleteMemory(memory.key, memory.category)}
                          size="small"
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          onClick={() => setDeleteDialog(memory.key)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <Warning color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium" color="error">
                        {memory.memory.value}
                      </Typography>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="error">
                          Was due: {formatEventTime(memory.memory.event_time)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created {formatDate(memory.memory.created_at)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < expiredMemories.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      {/* Header with Stats */}
      <Box sx={{ mb: 3, width: '100%'  }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              Memory Management
            </Typography>
            <Chip 
              icon={<Memory />}
              label={`${stats.total} memories`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Store and recall personal information, contacts, debts, and reminders
          </Typography>
        {/* <Box sx={{ display: 'flex', gap: 1 }}> */}
          {/* <Chip 
            icon={<Memory />}
            label={`${stats.total} memories`}
            color="primary"
            variant="outlined"
            size="small"
          /> */}
          {/* {stats.timedCount > 0 && (
            <Chip 
              icon={<AccessTime />}
              label={`${stats.timedCount} timed`}
              color="info"
              variant="outlined"
            />
          )} */}
        {/* </Box> */}
      </Box>

      {/* Add Memory Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add New Memory
        </Typography>
        
        <Alert severity="info" sx={{ mb: isMobile ? 2 : 3 }}>
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
      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
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
      </Grid> */}
      
      {/* Time-based Memory Stats */}
      {/* {timeStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{xs: 6, md: 6}}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Schedule color="primary" />
                </Box>
                <Typography variant="h5">{timeStats.timed_memories?.total || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Timed Memories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{xs: 6, md: 6}}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <CheckCircle color="success" />
                </Box>
                <Typography variant="h5">{timeStats.timed_memories?.completed || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Alarm color="warning" />
                </Box>
                <Typography variant="h5">{timeStats.timed_memories?.upcoming || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Upcoming
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Warning color="error" />
                </Box>
                <Typography variant="h5">{timeStats.timed_memories?.expired || 0}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Expired
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={handleCleanupMemories}
                  disabled={loading}
                >
                  Cleanup
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )} */}

      {/* Upcoming & Expired Panels */}
      {renderUpcomingPanel()}
      {renderExpiredPanel()}

      {/* Search and Filter */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center">
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
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
            >
              Filter
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Sort />}
              onClick={(e) => {
                const sortOptions = [
                  { value: 'created', label: 'Newest First' },
                  { value: 'event', label: 'Event Time' },
                  { value: 'category', label: 'Category' },
                  { value: 'status', label: 'Status' }
                ];
                setSortBy(sortOptions[(sortOptions.findIndex(o => o.value === sortBy) + 1) % sortOptions.length].value);
              }}
            >
              Sort
            </Button>
            
            <Button
              variant="outlined"
              onClick={loadMemories}
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          </Box>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', pt: 1, justifyContent: 'flex-end' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                size="small"
              />
            }
            label={`Show completed`}
            // sx={{ mt: 1 }}
          />
          <Chip 
            label={timeStats?.timed_memories?.completed || 0} 
            size="small" 
            color="success"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <MenuItem
          selected={timeFilter === 'all'}
          onClick={() => {
            setTimeFilter('all');
            setFilterMenuAnchor(null);
          }}
        >
          All Memories
        </MenuItem>
        <MenuItem
          selected={timeFilter === 'timed'}
          onClick={() => {
            setTimeFilter('timed');
            setFilterMenuAnchor(null);
          }}
        >
          Timed Only
        </MenuItem>
        <MenuItem
          selected={timeFilter === 'upcoming'}
          onClick={() => {
            setTimeFilter('upcoming');
            setFilterMenuAnchor(null);
          }}
        >
          Upcoming
        </MenuItem>
        <MenuItem
          selected={timeFilter === 'expired'}
          onClick={() => {
            setTimeFilter('expired');
            setFilterMenuAnchor(null);
          }}
        >
          Expired
        </MenuItem>
        <MenuItem
          selected={timeFilter === 'completed'}
          onClick={() => {
            setTimeFilter('completed');
            setFilterMenuAnchor(null);
          }}
        >
          Completed
        </MenuItem>
      </Menu>

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  {getMemoryIcon(tab.value)}
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
      ) : sortedMemories.length === 0 ? (
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
            <Paper sx={{ p: isMobile? 2 : 3, mb: isMobile ? 2 : 3, borderRadius: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 0,
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
                <List 
                  sx={{ 
                    '& .MuiListItem-root': {
                      px: 1
                    }
                  }}>
                  {categoryMemories.map((memory, index) => (
                    <React.Fragment key={memory.key}>
                      <ListItem
                        // secondaryAction={
                        //   <Box sx={{ display: 'flex', gap: 0.5 }}>
                        //     {memory.memory.is_timed && !memory.memory.is_completed && (
                        //       <Tooltip title="Mark as completed">
                        //         <IconButton
                        //           edge="end"
                        //           onClick={() => handleCompleteMemory(memory.key, memory.category)}
                        //           size="small"
                        //           color="success"
                        //         >
                        //           <CheckCircle />
                        //         </IconButton>
                        //       </Tooltip>
                        //     )}
                        //     <IconButton
                        //       edge="end"
                        //       onClick={() => setDeleteDialog(memory.key)}
                        //       color="error"
                        //       size="small"
                        //     >
                        //       <Delete />
                        //     </IconButton>
                        //   </Box>
                        // }
                      >
                        {/* <ListItemIcon>
                          {getMemoryIcon(category, memory.memory.is_timed)}
                        </ListItemIcon> */}
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                              {getMemoryIcon(category, memory.memory.is_timed)}
                              <Typography variant="subtitle1" fontWeight="medium">
                                {memory.original_key.replace(/_/g, ' ')}
                              </Typography>
                              <Chip
                                label={category}
                                size="small"
                                color={getMemoryColor(category, memory.memory.is_timed)}
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px', }}
                              />
                              {memory.memory.is_timed && (
                                <Chip
                                  label={getMemoryStatus(memory).label}
                                  size="small"
                                  color={getMemoryStatus(memory).color}
                                  icon={getMemoryStatus(memory).icon}
                                  sx={{ fontSize: '0.7rem', height: '20px', }}
                                />
                              )}
                              {/* <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                {formatDate(memory.memory.created_at)}
                              </Typography> */}
                            </Box>
                          }
                          secondaryTypographyProps={{ component: "div" }}
                          secondary={
                            <Box>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {memory.memory.value}
                              </Typography>
                              {memory.memory.description && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Info fontSize="small" color="action" />
                                  <Typography variant="body2" color="text.secondary">
                                    {memory.memory.description}
                                  </Typography>
                                </Box>
                              )}
                              {memory.memory.is_timed && renderTimeBasedMemory(memory)}
                            </Box>
                          }
                        />
                      </ListItem>
                      <Box sx={{ display: 'flex', gap: 0.5, my: 1, px: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" >
                          {formatDate(memory.memory.created_at)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {memory.memory.is_timed && !memory.memory.is_completed && (
                            <Tooltip title="Mark as completed">
                              <IconButton
                                edge="end"
                                onClick={() => handleCompleteMemory(memory.key, memory.category)}
                                size="small"
                                color="success"
                              >
                                <CheckCircle />
                              </IconButton>
                            </Tooltip>
                          )}
                          <IconButton
                            edge="end"
                            onClick={() => setDeleteDialog(memory.key)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                      {index < categoryMemories.length - 1 && <Divider  component="li" />} {/* variant="inset" */}
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