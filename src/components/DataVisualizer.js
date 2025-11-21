// src/components/DataVisualizer.js
import React, { useState, useEffect } from 'react';
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
  DialogActions
} from '@mui/material';
import {
  InsertDriveFile,
  Search,
  Delete,
  PictureAsPdf,
  Description,
  Image
} from '@mui/icons-material';
import { secondBrainAPI } from '../services/api';

const DataVisualizer = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = documents.filter(doc =>
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content_preview.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs(documents);
    }
  }, [searchQuery, documents]);

  const loadDocuments = async () => {
    try {
      const data = await secondBrainAPI.getDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

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
        return <Image color="success" />;
      default:
        return <InsertDriveFile />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  const displayDocs = searchQuery ? filteredDocs : documents;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Knowledge Base Documents
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Search />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search documents by name or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
          />
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Documents ({displayDocs.length})
          </Typography>
          <Chip 
            label={`${documents.length} total chunks`}
            variant="outlined"
          />
        </Box>

        {displayDocs.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            {searchQuery ? 'No documents match your search.' : 'No documents in knowledge base yet.'}
          </Typography>
        ) : (
          <List>
            {displayDocs.map((doc, index) => (
              <React.Fragment key={doc.id}>
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
                        <Typography variant="subtitle1" sx={{ cursor: 'pointer' }} onClick={() => setSelectedDoc(doc)}>
                          {doc.file_name}
                        </Typography>
                        <Chip
                          label={doc.file_type}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Chunk ${doc.chunk_index + 1}/${doc.total_chunks}`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {doc.content_preview}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Typography variant="caption">
                            Size: {formatFileSize(doc.file_size)}
                          </Typography>
                          <Typography variant="caption">
                            Added: {new Date(doc.ingestion_time).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < displayDocs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Document Detail Dialog */}
      <Dialog
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Document Details: {selectedDoc?.file_name}
        </DialogTitle>
        <DialogContent>
          {selectedDoc && (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={`Type: ${selectedDoc.file_type}`} />
                <Chip label={`Size: ${formatFileSize(selectedDoc.file_size)}`} />
                <Chip label={`Chunk: ${selectedDoc.chunk_index + 1}/${selectedDoc.total_chunks}`} />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Added: {new Date(selectedDoc.ingestion_time).toLocaleString()}
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {selectedDoc.content_preview}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDoc(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
      >
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog}"? This will remove all chunks of this document from your knowledge base.
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