import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

const TermsOfService = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      // fullScreen={{ xs: true, sm: false }}
      scroll="paper"
    >
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Terms of Service
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body2" paragraph>
            By accessing and using the Second Brain application (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            2. Use License
          </Typography>
          <Typography variant="body2" paragraph>
            Permission is granted to temporarily download one copy of the materials (information or software) on Second Brain's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 2 }}>
            <Typography component="li" variant="body2">Modifying or copying the materials</Typography>
            <Typography component="li" variant="body2">Using the materials for any commercial purpose or for any public display</Typography>
            <Typography component="li" variant="body2">Attempting to decompile or reverse engineer any software contained on the Service</Typography>
            <Typography component="li" variant="body2">Removing any copyright or other proprietary notations from the materials</Typography>
            <Typography component="li" variant="body2">Transferring the materials to another person or "mirroring" the materials on any other server</Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            3. Disclaimer
          </Typography>
          <Typography variant="body2" paragraph>
            The materials on Second Brain's website are provided on an 'as is' basis. Second Brain makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            4. Limitations
          </Typography>
          <Typography variant="body2" paragraph>
            In no event shall Second Brain or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Second Brain's website.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            5. Accuracy of Materials
          </Typography>
          <Typography variant="body2" paragraph>
            The materials appearing on Second Brain's website could include technical, typographical, or photographic errors. Second Brain does not warrant that any of the materials on its website are accurate, complete, or current. Second Brain may make changes to the materials contained on its website at any time without notice.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            6. Links
          </Typography>
          <Typography variant="body2" paragraph>
            Second Brain has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Second Brain of the site. Use of any such linked website is at the user's own risk.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            7. Modifications
          </Typography>
          <Typography variant="body2" paragraph>
            Second Brain may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            8. Governing Law
          </Typography>
          <Typography variant="body2" paragraph>
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Second Brain operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            9. User Responsibilities
          </Typography>
          <Typography variant="body2" paragraph>
            You agree not to use the Service for any unlawful purposes or in any way that could damage, disable, or impair the Service. You are responsible for maintaining the confidentiality of your account information and password.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            10. Contact Information
          </Typography>
          <Typography variant="body2" paragraph>
            If you have any questions about these Terms of Service, please contact us at support@secondbrain.ai
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsOfService;
