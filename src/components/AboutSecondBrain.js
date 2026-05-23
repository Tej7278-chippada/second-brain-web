// src/components/AboutSecondBrain.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * AboutSecondBrain Component
 * Displays comprehensive information about Second Brain for new users
 * Can be embedded in Login page or standalone
 */
const AboutSecondBrain = () => {
  const benefits = [
    {
      icon: <PsychologyIcon />,
      title: 'AI-Powered Memory',
      description: 'Never forget important information again. Your personal AI assistant remembers everything.'
    },
    {
      icon: <LightbulbIcon />,
      title: 'Intelligent Insights',
      description: 'Get smart suggestions and connect related information automatically.'
    },
    {
      icon: <SecurityIcon />,
      title: 'Private & Secure',
      description: 'Your data is encrypted and secure. Complete privacy for your personal information.'
    },
    {
      icon: <SpeedIcon />,
      title: 'Lightning Fast',
      description: 'Instant semantic search across all your documents and memories.'
    }
  ];

  const useCases = [
    {
      category: '👨‍💼 For Professionals',
      items: [
        'Store meeting notes and decisions',
        'Archive client interactions and communications',
        'Maintain project documentation and learnings',
        'Create audit trails for compliance',
        'Build institutional knowledge base',
        'Onboard new team members faster'
      ]
    },
    {
      category: '👤 For Personal Use',
      items: [
        'Keep personal journal and memories',
        'Store recipes, tips, and life hacks',
        'Organize learning materials and notes',
        'Archive important documents',
        'Track life goals and reflections',
        'Build your personal knowledge base'
      ]
    }
  ];

  const scenarios = [
    {
      title: 'Software Engineer',
      problem: 'Attending 5+ meetings daily, manager asks about yesterday\'s API discussion',
      solution: 'Simply query: "What API requirements were discussed yesterday?" Get instant, accurate answer',
      benefit: '⏰ Save 10+ minutes daily, zero stress'
    },
    {
      title: 'Sales Professional',
      problem: 'Client call scheduled, need to recall budget constraints from 3 months ago',
      solution: 'Search: "Budget constraints for Company X" - Get all relevant client history instantly',
      benefit: '🎯 Close deals faster with better context'
    },
    {
      title: 'Researcher',
      problem: 'Finding that one citation from hundreds of papers and notes',
      solution: 'Semantic search finds the exact reference instantly without manual review',
      benefit: '📚 Research efficiency increases 3x'
    },
    {
      title: 'Project Manager',
      problem: 'What was decided about the API redesign in that meeting from 2 weeks ago?',
      solution: 'Query retrieves all meeting notes with decisions and action items linked',
      benefit: '✅ Keep team aligned, reduce confusion'
    }
  ];

  const features = [
    'Drag-and-drop document upload',
    'Support for PDF, DOCX, images, audio',
    'AI-powered semantic search',
    'Real-time transcription',
    'Google OAuth authentication',
    'Secure data encryption',
    'Meeting memory integration',
    'Calendar sync (coming soon)',
    'Voice mode (coming soon)',
    'Gmail integration (coming soon)'
  ];

  const howItWorks = [
    {
      step: '1️⃣',
      title: 'Upload',
      description: 'Drag & drop your documents, notes, or files'
    },
    {
      step: '2️⃣',
      title: 'Index',
      description: 'AI processes and indexes all your data'
    },
    {
      step: '3️⃣',
      title: 'Search',
      description: 'Ask questions using natural language'
    },
    {
      step: '4️⃣',
      title: 'Retrieve',
      description: 'Get instant, accurate answers with context'
    }
  ];

  const securityFeatures = [
    {
      title: '🛡️ Your Data is Protected',
      items: [
        'End-to-end encryption',
        'Data encrypted at rest',
        'Secure authentication'
      ]
    },
    {
      title: '👤 Your Privacy Matters',
      items: [
        'Only you can access your data',
        'No data sharing or selling',
        'Full privacy control settings'
      ]
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', pt: 0, pb: { xs: 3, sm: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 2, md: 3 } }}>
        {/* Hero Section */}
        <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ 
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.5rem' }
          }}>
            🧠 What is Second Brain?
          </Typography>
          <Typography color="text.secondary" sx={{ 
            mb: 3,
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }
          }}>
            Your personal AI-powered knowledge assistant that stores, organizes, and intelligently retrieves your information
          </Typography>
          <Paper sx={{ p: { xs: 2, md: 3 }, bgcolor: 'primary.light' }}>
            <Typography sx={{ color: 'primary.dark', fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' } }}>
              <strong>Second Brain minimizes excess stress and confusion</strong> by being your digital memory. 
              It's like having a perfect assistant who remembers everything you tell them and instantly retrieves 
              exactly what you need, when you need it.
            </Typography>
          </Paper>
        </Box>

        {/* Why Second Brain Section - Cards adjacent on desktop, stacked on mobile */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography gutterBottom fontWeight="bold" sx={{ 
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' }
          }}>
            ✨ Why Second Brain?
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 2 },
            flexWrap: { md: 'wrap' }
          }}>
            {benefits.map((benefit, index) => (
              <Box key={index} sx={{ 
                flex: { md: '1 1 calc(25% - 16px)' },
                minWidth: { md: '200px' }
              }}>
                <Card sx={{ height: '100%', textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Box sx={{ color: 'primary.main', mb: 1, fontSize: { xs: 28, md: 32 } }}>
                      {benefit.icon}
                    </Box>
                    <Typography fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                      {benefit.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Real-Life Scenarios Section - Cards adjacent on desktop, stacked on mobile */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography gutterBottom fontWeight="bold" sx={{ 
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' }
          }}>
            📖 Real-Life Scenarios
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 2 },
            flexWrap: { md: 'wrap' }
          }}>
            {scenarios.map((scenario, index) => (
              <Box key={index} sx={{ 
                flex: { md: '1 1 calc(50% - 16px)' },
                minWidth: { md: '300px' }
              }}>
                <Card sx={{ height: '100%', border: '2px solid', borderColor: 'primary.light' }}>
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography fontWeight="bold" sx={{ color: 'primary.main', mb: 1, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                      {scenario.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: 'error.main', fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        ❌ Problem:
                      </Typography>
                      <Typography sx={{ mt: 0.5, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                        {scenario.problem}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        ✅ Solution:
                      </Typography>
                      <Typography sx={{ mt: 0.5, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                        {scenario.solution}
                      </Typography>
                    </Box>
                    <Paper sx={{ p: { xs: 1, md: 1.5 }, bgcolor: 'success.light' }}>
                      <Typography sx={{ color: 'success.dark', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                        {scenario.benefit}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Who Can Benefit Section - Cards adjacent on desktop, stacked on mobile */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography gutterBottom fontWeight="bold" sx={{ 
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' }
          }}>
            💼 Who Can Benefit?
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 2 },
            flexWrap: { md: 'wrap' }
          }}>
            {useCases.map((useCase, index) => (
              <Box key={index} sx={{ 
                flex: { md: '1 1 calc(50% - 16px)' },
                minWidth: { md: '300px' }
              }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography fontWeight="bold" gutterBottom sx={{ color: 'primary.main', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                      {useCase.category}
                    </Typography>
                    <List dense>
                      {useCase.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} disableGutters sx={{ py: { xs: 0.25, md: 0.5 } }}>
                          <ListItemIcon sx={{ minWidth: { xs: 28, md: 32 } }}>
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: 16, md: 18 } }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item}
                            primaryTypographyProps={{ sx: { fontSize: { xs: '0.85rem', md: '0.875rem' } } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Features */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography gutterBottom fontWeight="bold" sx={{ 
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' }
          }}>
            🎯 Key Features
          </Typography>
          <Grid container spacing={{ xs: 1, md: 1.5 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ p: { xs: 1.5, md: 2 }, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: 20, md: 24 } }} />
                  <Typography sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>{feature}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How It Works Section - Cards adjacent on desktop, stacked on mobile */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography gutterBottom fontWeight="bold" sx={{ 
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' }
          }}>
            🔄 How It Works
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 2 },
            flexWrap: { md: 'wrap' }
          }}>
            {howItWorks.map((step, index) => (
              <Box key={index} sx={{ 
                flex: { md: '1 1 calc(25% - 16px)' },
                minWidth: { md: '200px' }
              }}>
                <Card sx={{ textAlign: 'center', p: { xs: 1.5, md: 2 }, height: '100%' }}>
                  <Typography sx={{ color: 'primary.main', mb: 1, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                    {step.step} {step.title}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                    {step.description}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Security & Privacy Section - Cards adjacent on desktop, stacked on mobile */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography gutterBottom fontWeight="bold" sx={{ 
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' }
          }}>
            🔒 Security & Privacy
          </Typography>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 2 },
            flexWrap: { md: 'wrap' }
          }}>
            {securityFeatures.map((section, index) => (
              <Box key={index} sx={{ 
                flex: { md: '1 1 calc(50% - 16px)' },
                minWidth: { md: '300px' }
              }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography fontWeight="bold" gutterBottom sx={{ color: 'primary.main', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                      {section.title}
                    </Typography>
                    <List dense>
                      {section.items.map((item, itemIndex) => (
                        <ListItem key={itemIndex} disableGutters sx={{ py: { xs: 0.25, md: 0.5 } }}>
                          <ListItemIcon sx={{ minWidth: { xs: 28, md: 32 } }}>
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: 16, md: 18 } }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item}
                            primaryTypographyProps={{ sx: { fontSize: { xs: '0.85rem', md: '0.875rem' } } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', p: { xs: 2, md: 3 }, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography gutterBottom fontWeight="bold" sx={{ color: 'primary.dark', mb: 2, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            Ready to Transform Your Memory? 🚀
          </Typography>
          <Typography sx={{ color: 'primary.dark', mb: 2, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Sign in above and start building your personal knowledge base today
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSecondBrain;
