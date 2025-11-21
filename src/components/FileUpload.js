// src/components/FileUpload.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Upload,
//   InsertDriveFile,
  Delete,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';
import DataVisualizer from './DataVisualizer';

const FileUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const results = [];

    for (const fileObj of files) {
      try {
        fileObj.status = 'uploading';
        setFiles([...files]); // Trigger re-render

        const result = await secondBrainAPI.uploadFile(fileObj.file);
        results.push({
          filename: fileObj.file.name,
          status: 'success',
          result
        });
        fileObj.status = 'success';
      } catch (error) {
        results.push({
          filename: fileObj.file.name,
          status: 'error',
          error: error.message
        });
        fileObj.status = 'error';
      }
      setFiles([...files]); // Update progress
    }

    setUploadResults(results);
    setUploading(false);
    onUploadSuccess?.();

    // Clear files after 5 seconds
    setTimeout(() => {
      setFiles([]);
      setUploadResults([]);
    }, 5000);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const fileTypeIcons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📃',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      json: '📊',
      csv: '📊'
    };
    return fileTypeIcons[ext] || '📁';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'uploading':
        return <LinearProgress sx={{ width: 24 }} />;
      default:
        return <Upload color="disabled" />;
    }
  };

  return (
    <Box>
    <Box>
      <Typography variant="h5" gutterBottom>
        Upload Files to Your Second Brain
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Supported formats: PDF, DOCX, TXT, Images, JSON, CSV
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          backgroundColor: 'action.hover',
          mb: 3
        }}
      >
        <input
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.json,.csv"
          style={{ display: 'none' }}
          id="file-upload"
          multiple
          type="file"
          onChange={handleFileSelect}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<Upload />}
            size="large"
            disabled={uploading}
          >
            Select Files
          </Button>
        </label>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Click to select files or drag and drop
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Files ({files.length})
          </Typography>
          <List>
            {files.map((fileObj) => (
              <ListItem
                key={fileObj.id}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(fileObj.status)}
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(fileObj.id)}
                      disabled={uploading}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  <Typography variant="h6">
                    {getFileIcon(fileObj.file.name)}
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary={fileObj.file.name}
                  secondary={`${(fileObj.file.size / 1024 / 1024).toFixed(2)} MB`}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              fullWidth
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} Files`}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setFiles([])}
              disabled={uploading}
            >
              Clear All
            </Button>
          </Box>
        </Paper>
      )}

      {uploadResults.length > 0 && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Upload Results
          </Typography>
          {uploadResults.map((result, index) => (
            <Alert
              key={index}
              severity={result.status === 'success' ? 'success' : 'error'}
              sx={{ mb: 1 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{result.filename}</Typography>
                <Chip
                  label={result.status === 'success' ? 'Success' : 'Failed'}
                  color={result.status === 'success' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              {result.status === 'success' && result.result && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Extracted {result.result.chunks} chunks of knowledge
                </Typography>
              )}
            </Alert>
          ))}
        </Paper>
      )}
    </Box>
      <DataVisualizer/>
    </Box>
  );
};

export default FileUpload;