// src/components/DataVisualizer.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  // CardActions,
  // LinearProgress,
  Tabs,
  Tab,
  InputAdornment,
  // Tooltip,
  Alert,
  // Fade,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  InsertDriveFile,
  Search,
  Delete,
  PictureAsPdf,
  Description,
  Image,
  Description as TextIcon,
  BarChart,
  Storage,
  Refresh,
  Download,
  // FilterList,
  Sort,
  ContentCopy,
  // ZoomIn,
  // CalendarToday,
  ArrowUpward,
  ArrowDownward,
  Clear
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const DataVisualizer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [documents, setDocuments] = useState([]);
  // const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState({
    totalChunks: 0,
    totalFiles: 0,
    byType: {}
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  // useEffect(() => {
  //   filterAndSortDocuments();
  // }, [searchQuery, documents, activeTab, sortBy, sortOrder]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await secondBrainAPI.getDocuments();
      const docs = data.documents || [];
      setDocuments(docs);
      
      // Calculate statistics
      const stats = {
        totalChunks: data.total_chunks || 0,
        totalFiles: docs.length || 0,
        byType: {}
      };
      
      docs.forEach(doc => {
        const type = doc.file_type || 'Unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });
      
      setStats(stats);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useMemo for filteredDocs - more efficient
  const filteredDocs = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = searchQuery === '' || 
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = activeTab === 'all' || doc.file_type === activeTab;
      
      return matchesSearch && matchesType;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.file_name.toLowerCase();
          bValue = b.file_name.toLowerCase();
          break;
        case 'size':
          aValue = a.file_size || 0;
          bValue = b.file_size || 0;
          break;
        case 'date':
          aValue = new Date(a.ingestion_time || 0);
          bValue = new Date(b.ingestion_time || 0);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

    return filtered;
  }, [documents, searchQuery, activeTab, sortBy, sortOrder]);

  const handleDeleteDocument = async (filename) => {
    try {
      await secondBrainAPI.deleteDocument(filename);
      await loadDocuments();
      setDeleteDialog(null);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case '.pdf':
        return <PictureAsPdf color="error" />;
      case '.docx':
      case '.doc':
        return <Description color="primary" />;
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
        return <Image color="success" />;
      case '.txt':
      case '.md':
        return <TextIcon color="action" />;
      case '.json':
      case '.csv':
        return <BarChart color="warning" />;
      default:
        return <InsertDriveFile color="disabled" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getFileTypeCategories = () => {
    const categories = Object.entries(stats.byType)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({
        type,
        count,
        icon: getFileIcon(type)
      }));
    
    return [
      { type: 'all', count: stats.totalFiles, icon: <Storage /> },
      ...categories.slice(0, 5)
    ];
  };

  const exportToJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalDocuments: stats.totalFiles,
      documents: filteredDocs.map(doc => ({
        file_name: doc.file_name,
        file_type: doc.file_type,
        file_size: doc.file_size,
        ingestion_time: doc.ingestion_time,
        content_preview: doc.content_preview
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `second-brain-documents-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Header with Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
            Knowledge Base Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse and manage all documents in your second brain
          </Typography>
        </Box>
        {/* <Chip 
          icon={<Storage />}
          label={`${stats.totalFiles} files • ${stats.totalChunks} chunks`}
          color="primary"
          variant="outlined"
        /> */}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="primary.main">
                {stats.totalFiles}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Files
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="success.main">
                {stats.totalChunks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Chunks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="warning.main">
                {Object.keys(stats.byType).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                File Types
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToJSON}
                size="small"
              >
                Export
              </Button>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Search and Filter */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search documents by name or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Box sx={{ display: 'flex', gap: 1, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-start', }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Sort />}
            onClick={() => {
              if (sortBy === 'date') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('date');
                setSortOrder('desc');
              }
            }}
            size="small"
          >
            {sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
            Date
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Download />}
            onClick={exportToJSON}
            disabled={loading}
            size="small"
          >
            Export
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadDocuments}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* File Type Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {getFileTypeCategories().map((category) => (
            <Tab
              key={category.type}
              value={category.type}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {category.icon}
                  <span>{category.type === 'all' ? 'All' : category.type}</span>
                  <Chip
                    label={category.count}
                    size="small"
                    sx={{ height: 20, minWidth: 20, ml: 0.5 }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Documents List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredDocs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Storage sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try a different search term' : 'Upload files to get started'}
          </Typography>
        </Paper>
      ) : (
        <List>
          {filteredDocs.map((doc, index) => {
            // Create a unique key - use doc.id if available, otherwise create one
            const uniqueKey = doc.id || `doc-${index}-${doc.file_name}`;

            return (
              <React.Fragment key={uniqueKey}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => setDeleteDialog(doc.file_name)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {getFileIcon(doc.file_type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1"
                          sx={{
                            cursor: 'pointer',
                            // maxWidth: isMobile ? 260 : 540,
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
                          onClick={() => setSelectedDoc(doc)}
                        >
                          {doc.file_name}
                        </Typography>
                        <Chip
                          label={doc.file_type}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                    secondary={
                      <Box sx={{ gap: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={`${formatFileSize(doc.file_size)}`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`${doc.total_chunks || 1} Chunks`}
                            size="small"
                            color="primary" ml={1}
                          />
                          {/* <Typography variant="body2" color="text.secondary"
                            sx={{
                              // maxWidth: isMobile ? 360 : 740,   // ✅ Responsive width cap
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
                          >
                            {doc.content_preview}
                          </Typography> */}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {/* <Typography variant="caption">
                            Size: {formatFileSize(doc.file_size)}
                          </Typography>
                          <Typography variant="caption">
                            Added: {new Date(doc.ingestion_time).toLocaleString()}
                          </Typography> */}
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(doc.ingestion_time)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredDocs.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}

      {/* Document Detail Dialog */}
      <Dialog
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        fullScreen={isMobile}
      >
        <DialogTitle
          component="div"
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            whiteSpace: "normal",      //  Allows wrapping
            wordBreak: "break-word",   // Breaks very long words
            lineHeight: 1.4,
            pb: 1
          }}
        >
          {selectedDoc && getFileIcon(selectedDoc.file_type)}
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            {selectedDoc?.file_name}
          </Typography>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            p: isMobile ? 2 : 3
          }}>
          {selectedDoc && (
            <Box>
              {/* Metadata */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.2,
                  mb: 2
                }}
              >
                <Chip label={`Type: ${selectedDoc.file_type}`} size="small" />
                <Chip label={`Size: ${formatFileSize(selectedDoc.file_size)}`} size="small" />
                <Chip
                  label={`Total Chunk ${selectedDoc.total_chunks}`}
                  color="primary"
                  size="small"
                />
                {/* <Chip
                  label={`Added: ${formatDate(selectedDoc.ingestion_time)}`}
                  variant="outlined"
                  size="small"
                /> */}
                <Chip
                  label={`Added: ${new Date(selectedDoc.ingestion_time).toLocaleString()}`}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Content */}
              <Typography variant="subtitle2" gutterBottom>
                📚 Extracted Knowledge Content
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 1,
                  // bgcolor: 'background.default',
                  maxHeight: 400,
                  overflowY: 'auto'
                }}
              >
                <Typography
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    lineHeight: 1.6
                  }}
                >
                  {selectedDoc.content_preview}
                </Typography>
              </Paper>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDoc.content_preview);
                  }}
                  size="small"
                >
                  Copy Text
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedDoc(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will permanently delete all chunks of this document.
          </Alert>
          <Typography
            sx={{
              // fontWeight: 600,
              whiteSpace: "normal",     // Multiline enabled
              wordBreak: "break-word", // Prevents overflow
              maxWidth: "100%"         // Fits dialog width
            }}
          >
            Are you sure you want to delete <strong>{deleteDialog}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button
            onClick={() => handleDeleteDocument(deleteDialog)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataVisualizer;