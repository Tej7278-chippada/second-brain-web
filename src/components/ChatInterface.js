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
  CircularProgress
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Clear
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Chat with Your Second Brain
        </Typography>
        <Button
          startIcon={<Clear />}
          onClick={clearChat}
          variant="outlined"
          size="small"
        >
          Clear Chat
        </Button>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          p: 2, 
          mb: 2, 
          overflow: 'auto',
          backgroundColor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'grey.500', mt: 4 }}>
            <SmartToy sx={{ fontSize: 48, mb: 2 }} />
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
                <ListItem alignItems="flex-start">
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
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {message.content}
                        </Typography>
                        {message.sources && message.sources.length > 0 && (
                          <Box sx={{ mt: 1 }}>
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

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question or give a command... (e.g., 'memorize my phone number as 1234567890')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={3}
        />
        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{ minWidth: 100 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;