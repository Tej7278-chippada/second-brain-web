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

const PrivacyPolicy = ({ open, onClose }) => {
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
        Privacy Policy
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            1. Introduction
          </Typography>
          <Typography variant="body2" paragraph>
            Second Brain ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our Service.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            2. Information We Collect
          </Typography>
          <Typography variant="body2" paragraph>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 2 }}>
            <Typography component="li" variant="body2"><strong>Personal Data:</strong> Name, email address, and other identifying information you provide during registration</Typography>
            <Typography component="li" variant="body2"><strong>Account Information:</strong> Password, preferences, and profile settings</Typography>
            <Typography component="li" variant="body2"><strong>Usage Data:</strong> Information about how you interact with the Service</Typography>
            <Typography component="li" variant="body2"><strong>Device Information:</strong> Browser type, IP address, and device identifiers</Typography>
            <Typography component="li" variant="body2"><strong>Content:</strong> Files, documents, and data you upload to the Service</Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            3. Use of Your Information
          </Typography>
          <Typography variant="body2" paragraph>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 2 }}>
            <Typography component="li" variant="body2">Create and manage your account</Typography>
            <Typography component="li" variant="body2">Process your transactions and send related information</Typography>
            <Typography component="li" variant="body2">Improve and personalize the Service</Typography>
            <Typography component="li" variant="body2">Send promotional communications (with your consent)</Typography>
            <Typography component="li" variant="body2">Respond to your inquiries and provide customer support</Typography>
            <Typography component="li" variant="body2">Monitor and analyze usage trends and preferences</Typography>
            <Typography component="li" variant="body2">Detect and prevent fraudulent transactions</Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            4. Disclosure of Your Information
          </Typography>
          <Typography variant="body2" paragraph>
            We may share your information in the following circumstances:
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 2 }}>
            <Typography component="li" variant="body2"><strong>Service Providers:</strong> We may share data with vendors and service providers who assist us in operating the Service</Typography>
            <Typography component="li" variant="body2"><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</Typography>
            <Typography component="li" variant="body2"><strong>Business Transfers:</strong> Your information may be transferred as part of any merger, sale, or acquisition of our company</Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            5. Security of Your Information
          </Typography>
          <Typography variant="body2" paragraph>
            We use administrative, technical, and physical security measures to help protect your personal information. Although we strive to protect your personal information, we cannot guarantee its absolute security.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            6. Contact Us
          </Typography>
          <Typography variant="body2" paragraph>
            We are committed to addressing your concerns. If you have questions or complaints regarding our Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            Email: support@secondbrain.ai
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            7. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body2" paragraph>
            Second Brain reserves the right to modify this Privacy Policy at any time. Any changes will be posted on this page, and your continued use of the Service after such modifications constitutes your acceptance of the updated Privacy Policy.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            8. Your Rights
          </Typography>
          <Typography variant="body2" paragraph>
            You have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us at support@secondbrain.ai to exercise these rights.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            9. Data Retention
          </Typography>
          <Typography variant="body2" paragraph>
            We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            10. Third-Party Links
          </Typography>
          <Typography variant="body2" paragraph>
            The Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
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

export default PrivacyPolicy;
