// src/components/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  SmartToy,
  Clear,
  // DeleteOutline,
  History,
  Download,
  // ArrowUpwardRounded,
  MoreVert,
  ContentCopy,
  AutoAwesome,
  Refresh
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import { formatDistanceToNow } from 'date-fns';

const ChatInterface = ({ user, isMobile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add user greeting on first load
  // useEffect(() => {
  //   if (user && messages.length === 0) {
  //     const greeting = {
  //       id: Date.now(),
  //       content: `Hello ${user.username}! How can I help you today?`,
  //       role: 'assistant',
  //       timestamp: new Date(),
  //       isGreeting: true
  //     };
  //     setMessages([greeting]);
  //   }
  // }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // loadConversationHistory();
    inputRef.current?.focus();
  }, []);

  const loadConversationHistory = async () => {
    try {
      const data = await secondBrainAPI.getConversationHistory();
      setConversationHistory(data.history || []);
    } catch (error) {
      showSnackbar('Failed to load conversation history.', 'error');
      // console.error('Failed to load conversation history:', error);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await secondBrainAPI.sendMessage(input);
      
      const assistantMessage = {
        id: Date.now() + 1,
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
        sources: response.sources,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
      // loadConversationHistory(); // Refresh history
      setShowHistory(false);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'error',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      showSnackbar('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = async () => {
    try {
      await secondBrainAPI.clearConversationHistory();
      setMessages([]);
      setShowHistory(false);
      // loadConversationHistory();
      showSnackbar('Conversation history cleared', 'success');
    } catch (error) {
      showSnackbar('Failed to clear conversation history', 'error');
    }
  };

  const exportConversation = async () => {
    try {
      const data = await secondBrainAPI.exportConversationHistory();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `second-brain-conversation-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showSnackbar('Conversation exported successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to export conversation', 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard', 'success');
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return 'success';
    if (confidence > 0.5) return 'warning';
    return 'error';
  };

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', mb: isMobile ? 16 : 12 }}>
      {/* Header with Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" gutterBottom>
            Chat with Your Second Brain
          </Typography>
          {/* {messages.length > 0 && (
            <Chip 
              label={`${messages.length} messages`}
              size="small"
              variant="outlined"
            />
          )} */}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Clear chat history">
            <IconButton
              onClick={clearChat}
              size="small"
              disabled={messages.length === 0}
            >
              <Clear />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="More options">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); exportConversation(); }}>
              <Download sx={{ mr: 1 }} fontSize="small" />
              Export Conversation
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); loadConversationHistory(); setShowHistory(!showHistory); }}>
              <History sx={{ mr: 1 }} fontSize="small" />
              {showHistory ? 'Hide History' : 'Show History'}
            </MenuItem>
            <MenuItem onClick={() => { inputRef.current?.focus(); handleMenuClose(); }}>
              <AutoAwesome sx={{ mr: 1 }} fontSize="small" />
              Focus Input
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Conversation History Sidebar */}
      {showHistory && (
        <Paper elevation={1} sx={{ mb: 2, p: 2, maxHeight: 200, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Recent Conversations
            </Typography>
            <IconButton size="small" onClick={loadConversationHistory}>
              <Refresh fontSize="small" />
            </IconButton>
          </Box>
          {conversationHistory.length > 0 ? (
            <List dense>
              {conversationHistory.slice(-5).reverse().map((msg, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap sx={{ maxWidth: '100%' }}>
                        {msg.content.length > 60 ? msg.content.substring(0, 60) + '...' : msg.content}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(msg.timestamp)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No conversation history found.
            </Typography>
          )}
        </Paper>
      )}

      {/* Chat Messages */}
      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          p: isMobile ? 0.5 : 1, 
          mb: 0, 
          overflowY: 'auto',
          // pb: { xs: 12, sm: 10 }, // adds space at bottom so last messages are visible
          scrollBehavior: 'smooth',
          bgcolor: 'background.default',
          // backgroundColor: 'grey.50',
          // border: '1px solid',
          // borderColor: 'grey.200'
          borderRadius: 2
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'grey.500', my: 4 }}>
            {/* <AutoAwesomeRoundedIcon sx={{ fontSize: 48, mb: 2 }} /> */}
            <img 
              src="/logo/logoanim.svg" 
              alt="Second Brain Logo" 
              style={{ 
                width: 80, 
                height: 80,
                marginBottom: 16
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Welcome to Your Second Brain
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Ask questions about your documents, manage memories, or upload new files.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setInput("What documents do I have?")}
              >
                View documents
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setInput("Show memories")}
              >
                View memories
              </Button>
            </Box>
          </Box>
        ) : (
          <List>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem alignItems="flex-start" sx={{ px: 1}}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: message.role === 'user' ? 'primary.main' : 
                              message.role === 'error' ? null : null, // 'error.main' : 'secondary.main',
                      // border: message.role === 'user' ? '3px solid rgba(0, 0, 0, 0.6)' : 
                      //         message.role === 'error' ? '3px solid rgba(255, 0, 0, 0.6)' : null,
                      borderRadius: message.role === 'user' ? '50%' : '8px',
                    }}
                    src={
                      message.role === 'user'
                        ? user?.profile_pic
                        : "/logo/logo1.svg" 
                    }>
                      {message.role === 'user' ? user?.username?.[0]?.toUpperCase() : <SmartToy />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: 0.5 }}>
                          <Typography variant="subtitle2" component="span" fontWeight="bold">
                            {message.role === 'user' ? 'You' : 
                            message.role === 'error' ? 'Error' : 'Second Brain'}
                          </Typography>
                          {message.confidence && (
                            <Chip 
                              label={`${(message.confidence * 100).toFixed(0)}% confident`}
                              size="small"
                              color={getConfidenceColor(message.confidence)}
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {formatTimeAgo(message.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                    secondary={
                      <Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mb: 1,
                            lineHeight: 1.5,
                            // textAlign: 'justify',
                            whiteSpace: "pre-wrap", // Retain line breaks and tabs
                            wordWrap: "break-word", // Handle long words gracefully
                            p: 1,
                            borderRadius: 1,
                            // border: "1px solid #ddd",
                            bgcolor: message.role === 'user' ? 'action.hover' : 'transparent'
                          }}
                        >
                          {message.content}
                        </Typography>
                        {message.sources && message.sources.length > 0 && (
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StorageRoundedIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                            <Typography variant="caption" color="text.secondary">
                              Sources: {message.sources.join(', ')}
                            </Typography>
                            <IconButton
                              size="small"
                              sx={{ ml: 'auto' }}
                              onClick={() => copyToClipboard(message.content)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                        {/* <Typography variant="caption" color="text.secondary">
                          {message.timestamp.toLocaleTimeString()}
                        </Typography> */}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ my: 1 }} />
              </React.Fragment>
            ))}
            {loading && (
              <ListItem alignItems="flex-start" sx={{ px: 1}}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: null, borderRadius: '8px' }}
                    src={"/logo/logo1.svg"}>
                    <SmartToy />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2">Thinking...</Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Searching your knowledge base...
                    </Typography>
                  }
                />
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Paper>

      {/* Input Area */}
      <Box 
        sx={{
          position: 'fixed', // stays fixed at bottom even when scrolling
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)', // perfectly centers horizontally
          width: '100%',
          maxWidth: (theme) => theme.breakpoints.values.md,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          borderTop: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px 16px 0 0',
          zIndex: 10,
        }}
      >
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, scrollbarWidth: 'none' }}>
          {["Summarize documents of mine", "Show memories", "What can you do?"].map((text) => (
            <Chip
              key={text}
              label={text}
              size="small"
              variant="outlined"
              onClick={() => setInput(text)}
              sx={{ flexShrink: 0 }}
            />
          ))}
        </Box>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question or give a command... (e.g., 'memorize my phone number as 1234567890')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={6}
          inputRef={inputRef}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              paddingRight: 1,
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  size="small"
                  // variant="contained"
                  sx={{ 
                    color: input.trim() ? 'primary.main' : 'action.disabled',
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // backdropFilter: 'blur(5px)',
                    // border: '1px solid rgba(255, 255, 255, 0.2)', alignItems: 'flex-end',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <ArrowUpwardRoundedIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {/* <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{ minWidth: 100 }}
        >
          Send
        </Button> */}
        
        <Typography variant="caption" color="text.secondary" align="center">
          Press Enter to send • Shift+Enter for new line
        </Typography>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatInterface;