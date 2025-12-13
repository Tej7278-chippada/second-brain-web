// src/contexts/ChatContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { secondBrainAPI } from '../services/api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children, user }) => {
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const CHAT_STORAGE_KEY = `second_brain_chat_${user?.id || 'anonymous'}`;
  const HISTORY_STORAGE_KEY = `second_brain_history_${user?.id || 'anonymous'}`;

  const loadChatFromStorage = useCallback(() => {
    try {
      const savedChat = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedChat) {
        const parsedChat = JSON.parse(savedChat);
        // Parse dates back to Date objects
        const messagesWithDates = parsedChat.messages?.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) || [];
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Failed to load chat from storage:', error);
    }
  }, [CHAT_STORAGE_KEY]);

  const saveChatToStorage = useCallback((chatMessages) => {
    try {
      const chatData = {
        messages: chatMessages,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatData));
    } catch (error) {
      console.error('Failed to save chat to storage:', error);
    }
  }, [CHAT_STORAGE_KEY]);

  const loadHistoryFromStorage = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setConversationHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error);
    }
  }, [HISTORY_STORAGE_KEY]);

  useEffect(() => {
    loadChatFromStorage();
    loadHistoryFromStorage();
  }, [loadChatFromStorage, loadHistoryFromStorage]);

  const saveHistoryToStorage = useCallback((history) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history to storage:', error);
    }
  }, [HISTORY_STORAGE_KEY]);

  // Auto-save when messages change
  useEffect(() => {
    saveChatToStorage(messages);
  }, [messages, saveChatToStorage]);

  // Auto-save when history changes
  useEffect(() => {
    saveHistoryToStorage(conversationHistory);
  }, [conversationHistory, saveHistoryToStorage]);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addMessages = useCallback((newMessages) => {
    setMessages(prev => [...prev, ...newMessages]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, [CHAT_STORAGE_KEY]);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, [HISTORY_STORAGE_KEY]);

  const loadConversationHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const data = await secondBrainAPI.getConversationHistory();
      const history = data.history || [];
      setConversationHistory(history);
      saveHistoryToStorage(history);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [saveHistoryToStorage]);

  const addToConversationHistory = useCallback((userMessage, assistantMessage) => {
    setConversationHistory(prev => [
      ...prev,
      { ...userMessage, timestamp: userMessage.timestamp.toISOString() },
      { ...assistantMessage, timestamp: assistantMessage.timestamp.toISOString() }
    ].slice(-20)); // Keep last 20 messages
  }, []);

  const value = {
    messages,
    conversationHistory,
    isLoadingHistory,
    addMessage,
    addMessages,
    clearMessages,
    clearHistory,
    loadConversationHistory,
    addToConversationHistory
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};