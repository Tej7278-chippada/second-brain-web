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
  Chip,
  Fade,
  Tooltip
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

const FileUpload = ({ onUploadSuccess, isMobile }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // FILE SELECT
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  // DRAG & DROP HANDLERS
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const addFiles = (selectedFiles) => {
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      status: 'pending',
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    const results = [];

    for (let fileObj of files) {
      try {
        fileObj.status = 'uploading';
        fileObj.progress = 30;
        setFiles([...files]); // Trigger re-render

        const result = await secondBrainAPI.uploadFile(fileObj.file);
        fileObj.progress = 100;
        fileObj.status = 'success';
        results.push({
          filename: fileObj.file.name,
          status: 'success',
          result
        });
      } catch (error) {
        fileObj.status = 'error';
        results.push({
          filename: fileObj.file.name,
          status: 'error',
          error: error.message
        });
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
        return <LinearProgress sx={{ width: 24, borderRadius: '12px' }} />;
      default:
        return <Upload color="disabled" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  return (
    <Box>
    <Box>
      <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
        Upload Files to Your Second Brain
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Supported formats: PDF, DOCX, TXT, Images, JSON, CSV
      </Typography>

      <Paper 
        elevation={dragActive ? 6 : 2}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        sx={{ 
          p: 3, 
          textAlign: 'center',
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          backgroundColor: dragActive ? 'primary.light' : 'action.hover',
          mb: 3,
          transition: '0.3s',
          borderRadius: 3
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
        <Typography mt={2} color="text.secondary">
          Drag & drop files here or click to browse
        </Typography>
      </Paper>

      {/* FILE LIST */}
      {files.length > 0 && (
      <Fade in={files.length > 0}>
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
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
                <Tooltip title={fileObj.file.name} placement="top" arrow>
                  <ListItemText
                    primary={fileObj.file.name}
                    secondary= {formatFileSize(fileObj.file.size)}
                    sx={{
                      maxWidth: isMobile ? 160 : 340,   // ✅ Responsive width cap
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      
                      "& .MuiListItemText-primary": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500
                      }
                    }}
                  />
                </Tooltip>

              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, width:'100%', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              // fullWidth
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
      </Fade>)}

      {uploadResults.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
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