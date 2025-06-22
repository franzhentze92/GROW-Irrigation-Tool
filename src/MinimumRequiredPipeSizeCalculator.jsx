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
  { label: 'acre-in/day', value: 'acre-in/day', toGpm: v => v * 18.7 },
  { label: 'acre-in/hour', value: 'acre-in/hour', toGpm: v => v * 452.7 },
  { label: 'acre-ft/day', value: 'acre-ft/day', toGpm: v => v * 225.8 },
  { label: 'cms', value: 'cms', toGpm: v => v * 15850.3 },
];
const lengthUnits = [
  { label: 'ft', value: 'ft', toFt: v => v },
  { label: 'm', value: 'm', toFt: v => v * 3.28084 },
  { label: 'cm', value: 'cm', toFt: v => v * 0.0328084 },
  { label: 'mm', value: 'mm', toFt: v => v * 0.00328084 },
  { label: 'in', value: 'in', toFt: v => v / 12 },
];
const pressureUnits = [
  { label: 'psi', value: 'psi', toPsi: v => v },
  { label: 'kPa', value: 'kpa', toPsi: v => v * 0.145038 },
  { label: 'bar', value: 'bar', toPsi: v => v * 14.5038 },
  { label: 'm of water', value: 'mh2o', toPsi: v => v * 1.42233 },
  { label: 'feet of water', value: 'fth2o', toPsi: v => v * 0.4335 },
];
const diameterUnits = [
  { label: 'in', value: 'in', fromIn: v => v, toIn: v => v },
  { label: 'mm', value: 'mm', fromIn: v => v * 25.4, toIn: v => v / 25.4 },
  { label: 'cm', value: 'cm', fromIn: v => v * 2.54, toIn: v => v / 2.54 },
  { label: 'm', value: 'm', fromIn: v => v * 0.0254, toIn: v => v / 0.0254 },
  { label: 'ft', value: 'ft', fromIn: v => v / 12, toIn: v => v * 12 },
];

const pipeMaterials = [
  { label: 'Plastic', value: 150 },
  { label: 'Epoxy coated steel', value: 140 },
  { label: 'Cement asbestos', value: 140 },
  { label: 'Galvanized steel', value: 120 },
  { label: 'New steel', value: 120 },
  { label: 'Aluminum with couplers', value: 100 },
  { label: '15 year old steel', value: 100 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateMinPipeDiameter({ flow, flowUnit, length, lengthUnit, c, maxLoss, maxLossUnit, diameterUnit }) {
  if (!flow || !length || !c || !maxLoss) return null;
  const Q = flowUnits.find(u => u.value === flowUnit).toGpm(Number(flow));
  const L = lengthUnits.find(u => u.value === lengthUnit).toFt(Number(length));
  const C = Number(c);
  const Ploss = pressureUnits.find(u => u.value === maxLossUnit).toPsi(Number(maxLoss));
  if (Q <= 0 || L <= 0 || C <= 0 || Ploss <= 0) return null;
  // D = [4.53 * L * (Q/C)^1.852 / Ploss]^(1/4.857)
  const numerator = 4.53 * L * Math.pow(Q / C, 1.852);
  const D_in = Math.pow(numerator / Ploss, 1 / 4.857);
  const outConv = diameterUnits.find(u => u.value === diameterUnit).fromIn;
  return outConv(D_in);
}

const MinimumRequiredPipeSizeCalculator = () => {
  const [inputs, setInputs] = useState({
    flow: '',
    flowUnit: 'gpm',
    length: '',
    lengthUnit: 'ft',
    c: 150,
    maxLoss: '',
    maxLossUnit: 'psi',
    diameterUnit: 'in',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    const res = calculateMinPipeDiameter(inputs);
    setResult(res);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Minimum Required Pipe Size
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the minimum required pipe diameter for a given flow, length, material, and allowable pressure loss.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={4}>
        {/* Row 1 */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate In The Pipe"
              type="number"
              value={inputs.flow}
              onChange={handleInputChange('flow')}
              InputProps={{
                endAdornment: (
                  <Select
                    value={inputs.flowUnit}
                    onChange={handleInputChange('flowUnit')}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, minWidth: 140 }}
                  >
                    {flowUnits.map((u) => (
                      <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                    ))}
                  </Select>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Pipe Length"
              type="number"
              value={inputs.length}
              onChange={handleInputChange('length')}
              InputProps={{
                endAdornment: (
                  <Select
                    value={inputs.lengthUnit}
                    onChange={handleInputChange('lengthUnit')}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, minWidth: 120 }}
                  >
                    {lengthUnits.map((u) => (
                      <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                    ))}
                  </Select>
                ),
              }}
            />
          </FormControl>
        </Grid>

        {/* Row 2 */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pipe Material</InputLabel>
            <Select
              value={inputs.c}
              label="Pipe Material"
              onChange={handleInputChange('c')}
            >
              {pipeMaterials.map((u) => (
                <MenuItem key={u.value + u.label} value={u.value}>{u.label} (C={u.value})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Maximum Allowable Pressure Loss"
              type="number"
              value={inputs.maxLoss}
              onChange={handleInputChange('maxLoss')}
              InputProps={{
                endAdornment: (
                  <Select
                    value={inputs.maxLossUnit}
                    onChange={handleInputChange('maxLossUnit')}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, minWidth: 160 }}
                  >
                    {pressureUnits.map((u) => (
                      <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                    ))}
                  </Select>
                ),
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      {result !== null && (
        <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ ...fontSection, mb: 1 }} align="center">
            Minimum Pipe Size:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
            <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            <FormControl size="small">
              <Select
                value={inputs.diameterUnit}
                onChange={handleInputChange('diameterUnit')}
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
          The Equation
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, alignItems: 'center', p: 2, background: '#f5f5f5', borderRadius: 2 }}>
          <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 24, mr: 1 }}>P<sub>loss</sub> =</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 24 }}>4.53 × L × (Q/C)<sup>1.852</sup></Typography>
            <Box sx={{ borderTop: '2px solid #222', width: '100%' }} />
            <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 24 }}>D<sup>4.857</sup></Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            where:
          </Typography>
          <Box sx={{ display: 'inline-block', textAlign: 'left', mb: 2 }}>
            <Typography sx={{ fontSize: 16 }}><b>P<sub>loss</sub></b> = Pressure loss due to friction (psi)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>L</b> = Pipe length (ft)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q</b> = Flow rate of water inside pipe (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>C</b> = Pipe coefficient</Typography>
            <Typography sx={{ fontSize: 16, mb: 1 }}><b>D</b> = Pipe inside diameter (in)</Typography>
            <Typography sx={{ fontSize: 14 }}>Reference: Washington State University</Typography>
          </Box>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 13, color: '#888', mt: 4, textAlign: 'center' }}>
        Reference: Washington State University / IrrigationBox
      </Typography>
    </Paper>
  );
};

export default MinimumRequiredPipeSizeCalculator; 