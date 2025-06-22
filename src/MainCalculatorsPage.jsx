import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActionArea, Alert, Collapse, IconButton, AlertTitle } from '@mui/material';
import { Link } from 'react-router-dom';
import WaterIcon from '@mui/icons-material/Water';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HeightIcon from '@mui/icons-material/Height';
import TimerIcon from '@mui/icons-material/Timer';
import CropIcon from '@mui/icons-material/Crop';
import PowerIcon from '@mui/icons-material/Power';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpacityIcon from '@mui/icons-material/Opacity';
import StraightenIcon from '@mui/icons-material/Straighten';
import SpeedIcon from '@mui/icons-material/Speed';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import AdjustIcon from '@mui/icons-material/Adjust';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const MainCalculatorsPage = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const calculatorCategories = [
    {
      title: 'Water Application Rate',
      description: 'Calculate the rate at which water is applied to a given area',
      icon: <WaterIcon sx={{ fontSize: 40 }} />,
      path: '/water-application-rate',
      color: '#4CAF50'
    },
    {
      title: 'Irrigation Frequency',
      description: 'Determine how often irrigation should occur based on crop water use',
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      path: '/irrigation-frequency',
      color: '#2196F3'
    },
    {
      title: 'Water Depth',
      description: 'Calculate the depth of water applied during irrigation',
      icon: <HeightIcon sx={{ fontSize: 40 }} />,
      path: '/water-depth',
      color: '#9C27B0'
    },
    {
      title: 'Irrigation Run Time',
      description: 'Calculate the time needed for irrigation system to run',
      icon: <TimerIcon sx={{ fontSize: 40 }} />,
      path: '/irrigation-run-time',
      color: '#FF9800'
    },
    {
      title: 'Irrigatable Area',
      description: 'Calculate the land area that can be irrigated with a given water supply',
      icon: <CropIcon sx={{ fontSize: 40 }} />,
      path: '/irrigatable-area',
      color: '#795548'
    },
    {
      title: 'Required Water Pump Horsepower',
      description: 'Estimate brake horsepower and total power requirements for irrigation pumps',
      icon: <PowerIcon sx={{ fontSize: 40 }} />,
      path: '/required-water-pump-horsepower',
      color: '#E91E63'
    },
    {
      title: 'System Pumping Requirements',
      description: 'Calculate the total flow rate required to operate your irrigation system',
      icon: <OpacityIcon sx={{ fontSize: 40 }} />,
      path: '/system-pumping-requirements',
      color: '#00BCD4'
    },
    {
      title: 'Irrigation Times',
      description: 'Determine set time required for given water application and flow rate',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      path: '/irrigation-times',
      color: '#607D8B'
    },
    {
      title: 'Pipe Friction Loss',
      description: 'Calculate pressure loss due to pipe friction using the Hazen-Williams equation',
      icon: <StraightenIcon sx={{ fontSize: 40 }} />,
      path: '/pipe-friction-loss',
      color: '#FF5722'
    },
    {
      title: 'Pipe Water Velocity',
      description: 'Calculate water velocity inside a pipe using flow rate and diameter',
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      path: '/pipe-water-velocity',
      color: '#009688'
    },
    {
      title: 'Minimum Required Pipe Size',
      description: 'Calculate the minimum pipe diameter for a given flow, length, material, and pressure loss',
      icon: <DonutLargeIcon sx={{ fontSize: 40 }} />,
      path: '/minimum-required-pipe-size',
      color: '#8bc34a'
    },
    {
      title: 'Drip Line Application Rate',
      description: 'Calculate the application rate of a drip line irrigation system',
      icon: <OpacityIcon sx={{ fontSize: 40 }} />,
      path: '/drip-line-application-rate',
      color: '#3f51b5'
    },
    {
      title: 'Nozzle Application Rate',
      description: 'Calculate the effective application rate of a sprinkler nozzle system',
      icon: <WaterfallChartIcon sx={{ fontSize: 40 }} />,
      path: '/nozzle-application-rate',
      color: '#00bcd4'
    },
    {
      title: 'Nozzle Flow Rate / Diameter',
      description: 'Calculate nozzle flow rate or required diameter for a given pressure',
      icon: <AdjustIcon sx={{ fontSize: 40 }} />,
      path: '/nozzle-flow-rate-diameter',
      color: '#9c27b0'
    },
    {
      title: 'Garden Hose Flow Rate & Time',
      description: 'Calculate garden hose flow rate or time to fill a container',
      icon: <WaterDropIcon sx={{ fontSize: 40 }} />,
      path: '/garden-hose-flow-rate-time',
      color: '#4caf50'
    }
  ];

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700, color: '#222', mb: 3 }}>
        Irrigation Calculators
      </Typography>
      
      {/* Tool Explanation Section */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ 
          mb: 4, 
          backgroundColor: 'rgba(232, 245, 233, 0.5)',
          border: '1px solid #81c784',
          color: '#333',
          '& .MuiAlert-icon': {
            color: '#4caf50'
          }
        }}
        action={
          <IconButton
            aria-label="expand"
            size="small"
            onClick={() => setAboutOpen(!aboutOpen)}
          >
            {aboutOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      >
        <AlertTitle sx={{ fontWeight: 600 }}>About This Irrigation Tool</AlertTitle>
        <Collapse in={aboutOpen}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This comprehensive irrigation calculator suite is designed to help farmers, landscapers, and irrigation professionals optimize their irrigation systems for maximum efficiency and water conservation.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            What it does:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The tool provides 15 specialized calculators covering all aspects of irrigation planning, from basic water application rates to complex pump sizing and pipe design calculations.
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            How to use it:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2, mt: 0 }}>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              Select a calculator that matches your specific irrigation need
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              Enter your known values in the appropriate units
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              Choose your preferred output units from the dropdown menus
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
              View real-time calculations and results
            </Typography>
            <Typography component="li" variant="body1">
              Use the back button on any calculator page to return to this main menu
            </Typography>
          </Box>
          <Typography variant="body1">
            <strong>Note:</strong> All calculations assume ideal conditions and perfect irrigation efficiency. For real-world applications, consider factors like system efficiency, uniformity, and environmental conditions.
          </Typography>
        </Collapse>
      </Alert>

      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4, color: '#666' }}>
        Select an irrigation calculator to get started:
      </Typography>
      <Grid container spacing={3}>
        {calculatorCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardActionArea 
                component={Link} 
                to={category.path}
                sx={{ height: '100%', p: 3 }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: category.color, mb: 2 }}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#222' }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default MainCalculatorsPage; 