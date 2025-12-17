// src/components/FileUpload.js
import React, { useState, useCallback } from 'react';
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
  // Alert,
  Chip,
  Fade,
  // Tooltip,
  // Grid,
  // Card,
  // CardContent,
  // CardActions,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // Collapse,
  Tooltip
} from '@mui/material';
import {
  Upload,
  Delete,
  CheckCircle,
  Error,
  Description,
  PictureAsPdf,
  Image,
  InsertDriveFile,
  // ExpandMore,
  // ExpandLess
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { secondBrainAPI } from '../services/api';
import DataVisualizer from './DataVisualizer';

const FileUpload = ({ onUploadSuccess, isMobile }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  // const [uploadResults, setUploadResults] = useState([]);
  // const [dragActive, setDragActive] = useState(false);
  // const [showFileTypes, setShowFileTypes] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (!uploading && !files.some(f => f.status === 'success')) {
      addFiles(acceptedFiles);
    }
  }, [uploading, files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    noClick: uploading || files.some(f => f.status === 'success'), // Disable click
    noKeyboard: uploading || files.some(f => f.status === 'success'), // Disable keyboard
  });

  // DRAG & DROP HANDLERS
  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   setDragActive(false);
  //   const droppedFiles = Array.from(e.dataTransfer.files);
  //   addFiles(droppedFiles);
  // };

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
    const newUploadedDocuments = []; // Create a local array

    for (let fileObj of files) {
      try {
        fileObj.status = 'uploading';
        fileObj.progress = 30;
        setFiles([...files]); // Trigger re-render

        const result = await secondBrainAPI.uploadFile(fileObj.file);
        fileObj.progress = 100;
        fileObj.status = 'success';
        // Store uploaded document info in local array
        newUploadedDocuments.push({
          file_name: result.filename,
          file_type: `.${fileObj.file.name.split('.').pop()?.toLowerCase()}`,
          file_size: fileObj.file.size,
          ingestion_time: new Date().toISOString(),
          content_preview: `Uploaded file: ${fileObj.file.name}`,
          total_chunks: result.chunks || 1
        });
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

    // Update uploadedDocuments state once
    if (newUploadedDocuments.length > 0) {
      setUploadedDocuments(prev => [...prev, ...newUploadedDocuments]);
    }

    // setUploadResults(results);
    setUploading(false);
    onUploadSuccess?.(newUploadedDocuments); // Pass new uploaded documents to parent

    // Clear files after successful upload of 5 seconds
    if (results.some(r => r.status === 'success')) {
      setTimeout(() => {
        setFiles([]);
        // setUploadResults([]);
      }, 5000);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const fileTypeIcons = {
      pdf: <PictureAsPdf color="error" />,
      doc: <Description color="primary" />,
      docx: <Description color="primary" />,
      txt: <InsertDriveFile color="action" />,
      jpg: <Image color="success" />,
      jpeg: <Image color="success" />,
      png: <Image color="success" />,
      json: <Description color="warning" />,
      csv: <Description color="info" />
    };
    return fileTypeIcons[ext] || <InsertDriveFile />;
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
        return null; // <Upload color="disabled" />
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  // const supportedFileTypes = [
  //   { type: 'PDF', extensions: '.pdf', icon: <PictureAsPdf /> },
  //   { type: 'Word', extensions: '.docx, .doc', icon: <Description /> },
  //   { type: 'Text', extensions: '.txt', icon: <InsertDriveFile /> },
  //   { type: 'Images', extensions: '.jpg, .jpeg, .png', icon: <Image /> },
  //   { type: 'JSON', extensions: '.json', icon: <Description /> },
  //   { type: 'CSV', extensions: '.csv', icon: <Description /> }
  // ];

  return (
    <Box>
      <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
        Upload Files to Your Second Brain
      </Typography>
      {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Supported formats: PDF, DOCX, TXT, Images, JSON, CSV
      </Typography> */}
      
      {/* <Grid container spacing={2}> */}
        {/* Supported File Types */}
        {/* <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  Supported Formats
                </Typography>
                <IconButton size="small" onClick={() => setShowFileTypes(!showFileTypes)}>
                  {showFileTypes ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              <Collapse in={showFileTypes}>
                <Grid container spacing={1}>
                  {supportedFileTypes.map((fileType) => (
                    <Grid item xs={6} key={fileType.type}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                        {fileType.icon}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {fileType.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fileType.extensions}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Upload Stats */}
        {/* <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Stats
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color="primary">
                    {files.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Selected Files
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {files.filter(f => f.status === 'success').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Successfully Uploaded
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
      {/* </Grid> */}

      {/* Drop Zone */}
      <Paper 
        {...getRootProps()}
        elevation={isDragActive ? 6 : 2}
        // onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        // onDragLeave={() => setDragActive(false)}
        // onDrop={handleDrop}
        sx={{ 
          p: 4, 
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : (uploading || files.some(f => f.status === 'success')) ? 'action.disabled' : 'divider',
          backgroundColor: isDragActive ? 'primary.light' : (uploading || files.some(f => f.status === 'success')) ? 'action.disabledBackground' : 'action.hover',
          mb: 3,
          transition: 'all 0.3s',
          borderRadius: 3,
          cursor: (uploading || files.some(f => f.status === 'success')) ? 'not-allowed' : 'pointer',
          '&:hover': {
            borderColor: (uploading || files.some(f => f.status === 'success')) ? 'action.disabled' : 'primary.main',
            backgroundColor: (uploading || files.some(f => f.status === 'success')) ? 'action.disabledBackground' : 'action.selected'
          },
          opacity: (uploading || files.some(f => f.status === 'success')) ? 0.6 : 1
        }}
      >
        <input {...getInputProps()} disabled={uploading || files.some(f => f.status === 'success')} />
        <Upload sx={{ fontSize: 48, color: (uploading || files.some(f => f.status === 'success')) ? 'action.disabled' : 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drop files here or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Max file size: 50MB • Supports PDF, DOCX, TXT, Images, JSON, CSV
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} disabled={uploading || files.some(f => f.status === 'success')}>
          Select Files
        </Button>
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <Fade in={files.length > 0}>
          <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Selected Files ({files.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {/* <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  startIcon={<Upload />}
                >
                  {uploading ? 'Uploading...' : `Upload ${files.length} Files`}
                </Button> */}
                <Button
                  variant="outlined"
                  onClick={() => setFiles([])}
                  disabled={uploading || files.some(f => f.status === 'success')}
                  size="small"
                >
                  Clear All
                </Button>
              </Box>
            </Box>
            
            <List>
              {files.map((fileObj) => (
                <ListItem
                  key={fileObj.id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(fileObj.status)}
                      {fileObj.status === 'pending' && (
                        <IconButton
                          edge="end"
                          onClick={() => removeFile(fileObj.id)}
                          disabled={uploading}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getFileIcon(fileObj.file.name)}
                  </ListItemIcon>
                  <Tooltip title={fileObj.file.name} placement="top" arrow>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="medium" noWrap>
                          {fileObj.file.name}
                        </Typography>
                      }
                      secondaryTypographyProps={{ component: "div" }}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Typography variant="caption">
                            {formatFileSize(fileObj.file.size)}
                          </Typography>
                          {/* {fileObj.progress > 0 && fileObj.status === 'uploading' && (
                            <LinearProgress 
                              variant="determinate" 
                              value={fileObj.progress} 
                              sx={{ width: 100 }}
                            />
                          )} */}
                          {fileObj.status === 'success' && (
                            <Chip label="Uploaded" size="small" color="success" />
                          )}
                          {fileObj.status === 'error' && (
                            <Chip label="Failed" size="small" color="error" />
                          )}
                        </Box>
                      }
                    />
                  </Tooltip>
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', gap: 2, mt: 2, width:'100%', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading || files.length === 0 || files.some(f => f.status === 'success')}
                startIcon={<Upload />}
                fullWidth
              >
                {uploading ? 'Uploading...' : 
                  files.some(f => f.status === 'success') ? 'Upload Complete' : 
                  `Upload ${files.length} Files`}
              </Button>
              {/* <Button
                variant="outlined"
                onClick={() => setFiles([])}
                disabled={uploading}
              >
                Clear All
              </Button> */}
            </Box>
          </Paper>
        </Fade>
      )}

      {/* Upload Results */}
      {/* {uploadResults.length > 0 && (
        <Fade in={uploadResults.length > 0}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Results
            </Typography>
            {uploadResults.map((result, index) => (
              <Alert
                key={index}
                severity={result.status === 'success' ? 'success' : 'error'}
                sx={{ mb: 1 }}
                action={
                  result.status === 'success' && (
                    <Chip
                      label={`${result.result.chunks} chunks`}
                      size="small"
                      variant="outlined"
                    />
                  )
                }
              >
                <Typography variant="body2" fontWeight="medium">
                  {result.filename}
                </Typography>
                {result.status === 'success' && (
                  <Typography variant="caption" display="block">
                    Successfully processed and added to knowledge base
                  </Typography>
                )}
              </Alert>
            ))}
          </Paper>
        </Fade>
      )} */}

      {/* Data Visualizer */}
      <Box sx={{ mt: 4 }}>
        <DataVisualizer uploadedDocuments={uploadedDocuments} />
      </Box>
    </Box>
  );
};

export default FileUpload;