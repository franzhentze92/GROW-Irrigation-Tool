import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
} from '@mui/material';
import BackButton from './BackButton';

const flowUnits = [
  { label: 'gpm', value: 'gpm', toGpm: v => v },
  { label: 'lps', value: 'lps', toGpm: v => v * 15.8503 },
  { label: 'cfs', value: 'cfs', toGpm: v => v * 448.831 },
  { label: 'acre-in/day', value: 'acre-in-day', toGpm: v => v * 18.857 },
  { label: 'acre-ft/day', value: 'acre-ft-day', toGpm: v => v * 226.6 },
  { label: 'cms', value: 'cms', toGpm: v => v * 15850.3 },
];
const diameterUnits = [
  { label: 'in', value: 'in', toIn: v => v, fromIn: v => v },
  { label: 'mm', value: 'mm', toIn: v => v * 0.0393701, fromIn: v => v / 0.0393701 },
  { label: 'cm', value: 'cm', toIn: v => v * 0.393701, fromIn: v => v / 0.393701 },
  { label: 'ft', value: 'ft', toIn: v => v * 12, fromIn: v => v / 12 },
];
const velocityUnits = [
  { label: 'fps', value: 'fps', fromFtSec: v => v },
  { label: 'mps', value: 'mps', fromFtSec: v => v * 0.3048 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateVelocity({ flow, flowUnit, diameter, diameterUnit, velocityUnit }) {
  if (!flow || !diameter) return null;
  const Q = flowUnits.find(u => u.value === flowUnit).toGpm(Number(flow));
  const D = diameterUnits.find(u => u.value === diameterUnit).toIn(Number(diameter));
  if (Q <= 0 || D <= 0) return null;
  const V_ftsec = 0.408 * Q / (D * D);
  const outConv = velocityUnits.find(u => u.value === velocityUnit).fromFtSec;
  return outConv(V_ftsec);
}

function calculateMinDiameter({ flow, flowUnit, diameterUnit }) {
  if (!flow) return null;
  const Q = flowUnits.find(u => u.value === flowUnit).toGpm(Number(flow));
  if (Q <= 0) return null;
  // D = sqrt(0.408 * Q / V) where V = 5 fps
  const D_in = Math.sqrt(0.408 * Q / 5);
  const outConv = diameterUnits.find(u => u.value === diameterUnit).fromIn;
  return outConv(D_in);
}

const PipeWaterVelocityCalculator = () => {
  const [velocityInputs, setVelocityInputs] = useState({
    flow: '',
    flowUnit: 'gpm',
    diameter: '',
    diameterUnit: 'in',
    velocityUnit: 'fps',
  });
  const [minDiameterInputs, setMinDiameterInputs] = useState({
    flow: '',
    flowUnit: 'gpm',
    diameterUnit: 'in',
  });
  const [velocityResult, setVelocityResult] = useState(null);
  const [minDiameterResult, setMinDiameterResult] = useState(null);

  const handleVelocityInputChange = (field) => (event) => {
    setVelocityInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleMinDiameterInputChange = (field) => (event) => {
    setMinDiameterInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    const res = calculateVelocity(velocityInputs);
    setVelocityResult(res);
  }, [velocityInputs]);

  useEffect(() => {
    const res = calculateMinDiameter(minDiameterInputs);
    setMinDiameterResult(res);
  }, [minDiameterInputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Water Velocity Calculator
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the water velocity inside a pipe using flow rate and pipe diameter.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate"
              type="number"
              value={velocityInputs.flow}
              onChange={handleVelocityInputChange('flow')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Flow Rate Unit</InputLabel>
            <Select
              value={velocityInputs.flowUnit}
              label="Flow Rate Unit"
              onChange={handleVelocityInputChange('flowUnit')}
            >
              {flowUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Pipe Inside Diameter"
              type="number"
              value={velocityInputs.diameter}
              onChange={handleVelocityInputChange('diameter')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Diameter Unit</InputLabel>
            <Select
              value={velocityInputs.diameterUnit}
              label="Diameter Unit"
              onChange={handleVelocityInputChange('diameterUnit')}
            >
              {diameterUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {/* Result and output unit dropdown side by side, below input fields */}
      {velocityResult !== null && (
        <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ ...fontSection, mb: 1 }} align="center">
            Water Velocity:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
            <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
              {velocityResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            <FormControl size="small">
              <Select
                value={velocityInputs.velocityUnit}
                onChange={handleVelocityInputChange('velocityUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 100 }}
              >
                {velocityUnits.map((u) => (
                  <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      <Box sx={{ my: 4, borderTop: '1px solid #ddd' }} />

      <Typography gutterBottom sx={fontTitle} align="center">
        Minimum Pipe Diameter (5 fps)
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the minimum pipe diameter required for a 5 fps pipe velocity.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate"
              type="number"
              value={minDiameterInputs.flow}
              onChange={handleMinDiameterInputChange('flow')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Flow Rate Unit</InputLabel>
            <Select
              value={minDiameterInputs.flowUnit}
              label="Flow Rate Unit"
              onChange={handleMinDiameterInputChange('flowUnit')}
            >
              {flowUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {minDiameterResult !== null && (
        <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ ...fontSection, mb: 1 }} align="center">
            Minimum Pipe Diameter:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
            <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
              {minDiameterResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            <FormControl size="small">
              <Select
                value={minDiameterInputs.diameterUnit}
                onChange={handleMinDiameterInputChange('diameterUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 100 }}
              >
                {diameterUnits.map((u) => (
                  <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      {/* Formula centered, below result */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ ...fontSection, mb: 1 }} align="center">
          Formula:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ ...fontFormula, fontSize: 24, whiteSpace: 'nowrap' }}>
            V = 0.408 &times; Q / D<sup>2</sup>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, textAlign: 'left' }}>
            <Typography sx={{ fontSize: 16 }}><b>V</b> = Water velocity inside the pipe (ft/second)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q</b> = Flow rate of water inside pipe (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>D</b> = Pipe inside diameter (in)</Typography>
          </Box>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 13, color: '#888', mt: 4, textAlign: 'center' }}>
        Reference: Washington State University / IrrigationBox
      </Typography>
    </Paper>
  );
};

export default PipeWaterVelocityCalculator; 