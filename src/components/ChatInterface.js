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
//   IconButton,
  Divider,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  // Send,
  SmartToy,
  Person,
  Clear
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';

const ChatInterface = ({user, isMobile}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'error',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const clearChat = () => {
    setMessages([]);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return 'success';
    if (confidence > 0.5) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', mb: isMobile ? 16 : 12 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chat with Your Second Brain
        </Typography>
        {messages.length > 0 && (<Button
          startIcon={<Clear />}
          onClick={clearChat}
          variant="outlined"
          size="small"
        >
          Clear Chat
        </Button>)}
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          p: 1, 
          mb: 0, 
          overflowY: 'auto',
          // pb: { xs: 12, sm: 10 }, // 👈 adds space at bottom so last messages are visible
          scrollBehavior: 'smooth', 
          // backgroundColor: 'grey.50',
          // border: '1px solid',
          // borderColor: 'grey.200'
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'grey.500', my: 4 }}>
            {/* <AutoAwesomeRoundedIcon sx={{ fontSize: 48, mb: 2 }} /> */}
            <img 
              src="/logo/logoanim.svg" 
              alt="Second Brain Logo" 
              style={{ 
                width: isMobile ? 80 : 80, 
                height: isMobile ? 80 : 80,
                marginRight: 4 
              }} 
            />
            <Typography variant="h6">
              Welcome to Your Second Brain
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Ask questions about your documents, manage memories, or upload new files.
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem alignItems="flex-start" sx={{ px: 1}}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: message.role === 'user' ? 'primary.main' : 
                              message.role === 'error' ? 'error.main' : 'secondary.main'
                    }}>
                      {message.role === 'user' ? <Person /> : <SmartToy />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" component="span">
                          {message.role === 'user' ? 'You' : 'Second Brain'}
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
                    }
                    secondary={
                      <Box>
                        <Typography variant="body1" sx={{ mb: 1 }}
                          style={{
                          // marginTop: '0.5rem',
                          lineHeight: '1.5',
                          // textAlign: 'justify',
                          whiteSpace: "pre-wrap", // Retain line breaks and tabs
                          wordWrap: "break-word", // Handle long words gracefully
                          // backgroundColor: "#f5f5f5",
                          // padding: "1rem",
                          borderRadius: "8px",
                          // border: "1px solid #ddd",
                        }}>
                          {message.content}
                        </Typography>
                        {message.sources && message.sources.length > 0 && (
                          <Box sx={{ mt: 1, alignContent: 'center' }}>
                            <StorageRoundedIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              Sources: {message.sources.join(', ')}
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
            {loading && (
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
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
                />
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Paper>

      <Box 
        sx={{
          position: 'fixed',          // stays fixed at bottom even when scrolling
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)', // perfectly centers horizontally
          width: '100%',
          maxWidth: (theme) => theme.breakpoints.values.md, // equals 900px
          display: 'flex', flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
          borderTop: '1px solid grey.200',
          borderColor: 'grey.200',
          borderRadius: '16px 16px 0 0',
          zIndex: 10,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question or give a command... (e.g., 'memorize my phone number as 1234567890')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={8}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 1,
          }}
          InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      size="small"
                      variant="contained"
                      sx={{ mr: '6px',
                        color:  'rgba(0, 0, 0, 0.6)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)', alignItems: 'flex-end'
                       }}
                    >
                      <ArrowUpwardRoundedIcon color="action" fontSize="small" />
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
      </Box>
    </Box>
  );
};

export default ChatInterface;