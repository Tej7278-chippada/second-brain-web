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
  Snackbar,
  Collapse
} from '@mui/material';
import {
  SmartToy,
  // Clear,
  // DeleteOutline,
  History,
  Download,
  // ArrowUpwardRounded,
  MoreVert,
  ContentCopy,
  // AutoAwesome,
  Refresh,
  Code,
  KeyboardArrowDown,
  KeyboardArrowUp,
  // DeleteForeverRounded,
  ClearAllRounded,
  CloseRounded,
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '../contexts/ChatContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { atomDark, vs, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Helper function to detect code blocks in text
const detectCodeBlocks = (text) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  const codeBlocks = [];
  let lastIndex = 0;
  let match;

  // Process code blocks
  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      codeBlocks.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }

    // Add code block
    codeBlocks.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2]
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    codeBlocks.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }

  // Process inline code in text blocks
  const processedBlocks = codeBlocks.map(block => {
    if (block.type === 'text') {
      const parts = [];
      let text = block.content;
      let inlineLastIndex = 0;
      let inlineMatch;

      while ((inlineMatch = inlineCodeRegex.exec(text)) !== null) {
        // Add text before inline code
        if (inlineMatch.index > inlineLastIndex) {
          parts.push({
            type: 'text',
            content: text.substring(inlineLastIndex, inlineMatch.index)
          });
        }

        // Add inline code
        parts.push({
          type: 'inlineCode',
          content: inlineMatch[1]
        });

        inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
      }

      // Add remaining text
      if (inlineLastIndex < text.length) {
        parts.push({
          type: 'text',
          content: text.substring(inlineLastIndex)
        });
      }

      return parts.length > 0 ? parts : [block];
    }
    return [block];
  }).flat();

  return processedBlocks;
};

// Helper to detect programming language from content
const detectLanguage = (content) => {
  const languagePatterns = {
    python: /\b(def|import|from|class|print|lambda|yield)\b/,
    javascript: /\b(const|let|var|function|=>|console\.|import\s)/,
    java: /\b(public|private|class|static|void|System\.out\.)/,
    cpp: /\b(#include|cout|cin|std::|namespace)\b/,
    html: /<\w+/,
    css: /[.#][\w-]+\s*{/,
    sql: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE)\b/i,
    json: /{.*}/,
    bash: /^\$|#!\/bin\/bash/
  };

  for (const [lang, pattern] of Object.entries(languagePatterns)) {
    if (pattern.test(content)) {
      return lang;
    }
  }
  return 'text';
};

const ChatInterface = ({ user, isMobile }) => {
  const { 
    messages, 
    conversationHistory, 
    isLoadingHistory,
    addMessage, 
    clearMessages, 
    loadConversationHistory,
    addToConversationHistory
  } = useChat(); // Use chat context

  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // const [conversationHistory, setConversationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showCodeTheme, setShowCodeTheme] = useState(true);
  const [showCodePreview, setShowCodePreview] = useState({});

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
  }, [loadConversationHistory]);

  // const loadConversationHistory = async () => {
  //   try {
  //     const data = await secondBrainAPI.getConversationHistory();
  //     setConversationHistory(data.history || []);
  //   } catch (error) {
  //     showSnackbar('Failed to load conversation history.', 'error');
  //     // console.error('Failed to load conversation history:', error);
  //   }
  // };

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

    addMessage(userMessage);
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

      addMessage(assistantMessage);
      // loadConversationHistory(); // Refresh history
      setShowHistory(false);
      // Add to conversation history
      addToConversationHistory(userMessage, assistantMessage);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'error',
        timestamp: new Date()
      };
      addMessage(errorMessage);
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
      clearMessages();
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
      // const chatData = {
      //   user: user?.username || 'Anonymous',
      //   exportedAt: new Date().toISOString(),
      //   messages: messages.map(msg => ({
      //     role: msg.role,
      //     content: msg.content,
      //     timestamp: msg.timestamp.toISOString(),
      //     sources: msg.sources,
      //     confidence: msg.confidence
      //   }))
      // };
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

  const copyCodeToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    showSnackbar('Code copied to clipboard', 'success');
  };

  const toggleCodeTheme = () => {
    setShowCodeTheme(prev => !prev);
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

  const handleLoadHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
    } else {
      setShowHistory(true);
      await loadConversationHistory();
    }
  };

  // const enhancedDarkTheme = {
  //   ...vscDarkPlus,
  //   'pre[class*="language-"]': {
  //     ...vscDarkPlus['pre[class*="language-"]'],
  //     background: '#0f172a', // slate-900 (VS Code-like)
  //     fontFamily: `'JetBrains Mono', 'Fira Code', monospace`
  //   },
  //   'code[class*="language-"]': {
  //     ...vscDarkPlus['code[class*="language-"]'],
  //     color: '#e5e7eb'
  //   }
  // };

  // const enhancedLightTheme = {
  //   ...oneLight,
  //   'pre[class*="language-"]': {
  //     ...oneLight['pre[class*="language-"]'],
  //     background: '#f8fafc',
  //     fontFamily: `'JetBrains Mono', 'Fira Code', monospace`
  //   }
  // };

  const renderMessageContent = (content) => {
    const blocks = detectCodeBlocks(content);
    
    return blocks.map((block, index) => {
      if (block.type === 'code') {
        const language = block.language === 'text' ? detectLanguage(block.content) : block.language;
        return (
          <Box key={index} sx={{ my: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: showCodeTheme ? 'grey.900' : 'grey.200',
              color: showCodeTheme ? 'grey.100' : 'grey.900',
              p: 1,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              fontSize: '0.75rem'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code fontSize="small" />
                <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                  {language}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Toggle code theme">
                <IconButton
                  size="small"
                  onClick={toggleCodeTheme}
                  sx={{ color: 'inherit' }}
                >
                  {showCodeTheme ? (
                    <Brightness7Icon fontSize="small" />
                  ) : (
                    <Brightness4Icon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy code">
                <IconButton
                  size="small"
                  onClick={() => copyCodeToClipboard(block.content)}
                  sx={{ color: 'inherit' }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={showCodePreview[block.blockId] ? "Collapse" : "Expand"}>
                <IconButton
                  size="small"
                  sx={{ color: 'inherit' }}
                  onClick={() => setShowCodePreview(prev => ({
                    ...prev,
                    [block.blockId]: !prev[block.blockId]
                  }))}
                >
                  {showCodePreview[block.blockId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Tooltip>
            </Box>
            </Box>
            <Collapse in={showCodePreview[block.blockId] !== false}>
              <SyntaxHighlighter
                language={language}
                style={showCodeTheme ? vscDarkPlus : prism}
                customStyle={{
                  margin: 0,
                  borderRadius: '0 0 4px 4px',
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  // maxHeight: '400px',
                  // overflow: 'auto'
                }}
                showLineNumbers={block.content.split('\n').length > 5}
                lineNumberStyle={{ minWidth: '3em' }}
              >
                {block.content}
              </SyntaxHighlighter>
            </Collapse>
          </Box>
        );
      } else if (block.type === 'inlineCode') {
        return (
          <code
            key={index}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: '2px 4px',
              borderRadius: 3,
              fontFamily: `'JetBrains Mono', monospace`,
              fontSize: '0.9em'
            }}
          >
            {block.content}
          </code>
        );
      } else {
        return (
          <Typography
            key={index}
            component="span"
            sx={{
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {block.content}
          </Typography>
        );
      }
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', mb: isMobile ? 16 : 12 }}>
      {/* Header with Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h6" >
              Hey! {user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chat with Your Second Brain
            </Typography>
          </Box>
          {/* {messages.length > 0 && (
            <Chip 
              label={`${messages.length} messages`}
              size="small"
              variant="outlined"
            />
          )} */}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* <Tooltip title="Clear chat history">
            <span>
              <IconButton
                onClick={clearChat}
                size="small"
                disabled={messages.length === 0}
              >
                <Clear />
              </IconButton>
            </span>
          </Tooltip> */}
          <Tooltip title={showHistory ? 'Hide History' : 'Show Chat History'}>
            <span>
              <IconButton
                onClick={() => { handleLoadHistory(); }}
                size="small"
              >
                {showHistory ? <CloseRounded/> : <History />}
              </IconButton>
            </span>
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
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); exportConversation(); }}>
              <Download sx={{ mr: 1 }} fontSize="small" />
              Export Conversation
            </MenuItem>
            {/* <MenuItem onClick={() => { handleMenuClose(); handleLoadHistory(); }}>
              <History sx={{ mr: 1 }} fontSize="small" />
              {showHistory ? 'Hide History' : 'Show History'}
            </MenuItem> */}
            {/* <MenuItem onClick={() => { inputRef.current?.focus(); handleMenuClose(); }}>
              <AutoAwesome sx={{ mr: 1 }} fontSize="small" />
              Focus Input
            </MenuItem> */}
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
            <Box>
              <Tooltip title="Refetch history">
                <IconButton size="small" onClick={loadConversationHistory} disabled={isLoadingHistory}>
                  {isLoadingHistory ? <CircularProgress size={16} /> : <Refresh fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear history">
                <span>
                  <IconButton
                    onClick={clearChat}
                    size="small" sx={{ ml: 1 }}
                    disabled={conversationHistory.length === 0 || isLoadingHistory}
                  >
                    <ClearAllRounded />
                  </IconButton>
                </span>
              </Tooltip>
              {/* <Tooltip title="Close history">
                <span>
                  <IconButton
                    onClick={() => {setShowHistory(false)}}
                    size="small" sx={{ ml: 1 }}
                    disabled={conversationHistory.length === 0 || isLoadingHistory}
                  >
                    <Clear />
                  </IconButton>
                </span>
              </Tooltip> */}
            </Box>
          </Box>
          {conversationHistory.length > 0 ? (
            <List dense>
              {conversationHistory.slice(-5).reverse().map((msg, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1, maxWidth: '100%', flexDirection: isMobile ? 'column' : 'row' }}>
                        <Typography variant="subtitle2" component="span" fontWeight="bold">
                          {msg.role === 'user' ? 'You:' : 
                          msg.role === 'error' ? 'Error' : 'Second Brain:'}
                        </Typography>
                        <Typography variant="body2" noWrap sx={{ maxWidth: '100%' }}>
                          {msg.content.length > 60 ? msg.content.substring(0, 60) + '...' : msg.content}
                        </Typography>
                      </Box>
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
          <Box sx={{ textAlign: 'center', color: 'grey.500', mt: isMobile? 9 : 5 }}>
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
                  {/* <ListItemAvatar>
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
                  </ListItemAvatar> */}
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: 0.5 }}>
                          <Typography variant="subtitle1" component="span" fontWeight="bold">
                            {message.role === 'user' ? 'You' : 
                            message.role === 'error' ? 'Error' : 'Second Brain'}
                          </Typography>
                          {message.confidence && (
                            <Chip 
                              label={`${(message.confidence * 100).toFixed(0)}% confident`}
                              size="small"
                              color={getConfidenceColor(message.confidence)}
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: '20px', }}
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
                        <Box 
                          sx={{ 
                            my: 1,
                            p: 1,
                            borderRadius: 1,
                            bgcolor: message.role === 'user' ? 'action.hover' : 'transparent'
                          }}
                        >
                          {renderMessageContent(message.content)}
                        </Box>
                        {message.sources && message.sources.length > 0 && (
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 0.5,
                              maxWidth: '100%',
                            }}
                          >
                            <StorageRoundedIcon sx={{ fontSize: 16, opacity: 0.7, mt: '2px' }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                flex: 1,
                              }}
                            >
                              Sources: {message.sources.join(', ')}
                            </Typography>
                            <IconButton
                              size="small"
                              sx={{ ml: 0.5, flexShrink: 0 }}
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
                <Divider component="li" sx={{ my: 1 }} />   {/* variant="inset"  */}
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
          position: 'fixed', // 'fixed' stays fixed at bottom even when scrolling
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)', // perfectly centers horizontally
          width: '100%',
          maxWidth: (theme) => theme.breakpoints.values.md,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          px: 1.5,
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
        {/* <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, scrollbarWidth: 'none' }}>
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
        </Box> */}
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about your memories or files."
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
            endAdornment: !isMobile && (
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
        <Box 
          sx={{
            display: 'flex', 
            justifyContent: 'space-between',
            // bgcolor: 'background.default',
            // borderRadius: 1,
            // '& .MuiOutlinedInput-root': {
            //   paddingRight: 1,
            // },
            alignItems: 'center',
            px: 0.5,
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {["Summarize documents of mine", "Summarize the context of last ingested file", "What can you do?"].map((text) => (
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
          {isMobile && (
            <IconButton 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              size="small"
              // variant="contained"
              sx={{ 
                color: input.trim() ? 'primary.main' : 'action.disabled',
                bgcolor: 'background.default',
                // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                border: input.trim() ? null : '1px solid rgba(255, 255, 255, 0.2)', 
                alignItems: 'flex-end',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <ArrowUpwardRoundedIcon />
            </IconButton>
          )}
        </Box>

        {/* <Button
          variant="contained"
          endIcon={<Send />}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          sx={{ minWidth: 100 }}
        >
          Send
        </Button> */}
        
        {/* <Typography variant="caption" color="text.secondary" align="center">
          Press Enter to send • Shift+Enter for new line
        </Typography> */}
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