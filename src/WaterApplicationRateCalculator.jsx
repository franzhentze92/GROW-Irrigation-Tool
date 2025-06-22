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

const areaUnits = [
  { label: 'acre', value: 'acre' },
  { label: 'hectare', value: 'hectare' },
  { label: 'sq. in.', value: 'sqin' },
  { label: 'sq. ft.', value: 'sqft' },
  { label: 'sq. cm.', value: 'sqcm' },
  { label: 'sq. meter', value: 'sqm' },
  { label: 'sq. yd.', value: 'sqyd' },
  { label: 'sq. km', value: 'sqkm' },
  { label: 'sq. mile', value: 'sqmile' },
];

const flowRateUnits = [
  { label: 'lps', value: 'lps' },
  { label: 'lph', value: 'lph' },
  { label: 'lpd', value: 'lpd' },
  { label: 'gpm', value: 'gpm' },
  { label: 'gph', value: 'gph' },
  { label: 'gpd', value: 'gpd' },
  { label: 'cfs', value: 'cfs' },
  { label: 'acre-in/day', value: 'acreinday' },
  { label: 'acre-in/hour', value: 'acreinhr' },
  { label: 'acre-ft/day', value: 'acrefday' },
  { label: 'cms', value: 'cms' },
  { label: 'cu. m/hr', value: 'cumhr' },
];

const appRateUnits = [
  { label: 'mm/hr', value: 'mmhr' },
  { label: 'mm/day', value: 'mmday' },
  { label: 'cm/hr', value: 'cmhr' },
  { label: 'cm/day', value: 'cmday' },
  { label: 'in/hr', value: 'inhr' },
  { label: 'in/day', value: 'inday' },
];

function convertAreaToAcres(value, unit) {
  switch (unit) {
    case 'acre': return value;
    case 'hectare': return value * 2.47105;
    case 'sqin': return value / 6272640;
    case 'sqft': return value / 43560;
    case 'sqcm': return value / 40468564.224;
    case 'sqm': return value / 4046.86;
    case 'sqyd': return value / 4840;
    case 'sqkm': return value * 247.105;
    case 'sqmile': return value * 640;
    default: return value;
  }
}

function convertFlowRateToGpm(value, unit) {
  switch (unit) {
    case 'gpm': return value;
    case 'lps': return value * 15.8503;
    case 'lph': return value * 0.00440287;
    case 'lpd': return value * 0.000183453;
    case 'gph': return value / 60;
    case 'gpd': return value / 1440;
    case 'cfs': return value * 448.831;
    case 'acreinday': return value * 27154;
    case 'acreinhr': return value * 651696;
    case 'acrefday': return value * 271540;
    case 'cms': return value * 15850.3;
    case 'cumhr': return value * 4.40287;
    default: return value;
  }
}

function convertInHrToOutputUnit(value, unit) {
  switch (unit) {
    case 'mmhr': return value * 25.4;
    case 'mmday': return value * 25.4 * 24;
    case 'cmhr': return value * 2.54;
    case 'cmday': return value * 2.54 * 24;
    case 'inhr': return value;
    case 'inday': return value * 24;
    default: return value;
  }
}

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

const WaterApplicationRateCalculator = () => {
  const [inputs, setInputs] = useState({
    area: 0,
    areaUnit: 'acre',
    flowRate: 0,
    flowRateUnit: 'gpm',
    appRateUnit: 'mmhr',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (
    event
  ) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: field.includes('Unit') ? value : Number(value),
    }));
  };

  // Dedicated handler for number/text fields
  const handleNumberInputChange = (field) => (
    event
  ) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  useEffect(() => {
    calculateAppRate();
    // eslint-disable-next-line
  }, [inputs]);

  const calculateAppRate = () => {
    const areaAcres = convertAreaToAcres(inputs.area, inputs.areaUnit);
    const flowGpm = convertFlowRateToGpm(inputs.flowRate, inputs.flowRateUnit);
    if (areaAcres <= 0 || flowGpm <= 0) {
      setResult(null);
      return;
    }
    // AR (in/hr) = q / (A * 452.57)
    const appRateInHr = flowGpm / (areaAcres * 452.57);
    const finalRate = convertInHrToOutputUnit(appRateInHr, inputs.appRateUnit);
    setResult(finalRate);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Water Application Rate
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Use this form to calculate the water application rate using the flow rate on an area. This calculator assumes perfect irrigation efficiency and uniformity.
      </Typography>
      <Box sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Area"
              type="number"
              value={inputs.area}
              onChange={handleNumberInputChange('area')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Area Unit</InputLabel>
            <Select
              value={inputs.areaUnit}
              label="Area Unit"
              onChange={handleInputChange('areaUnit')}
            >
              {areaUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate"
              type="number"
              value={inputs.flowRate}
              onChange={handleNumberInputChange('flowRate')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Flow Rate Unit</InputLabel>
            <Select
              value={inputs.flowRateUnit}
              label="Flow Rate Unit"
              onChange={handleInputChange('flowRateUnit')}
            >
              {flowRateUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Result and output unit dropdown side by side, below input fields */}
      {result !== null && (
        <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ ...fontSection, mb: 1 }} align="center">
            Result:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
            <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
              {result.toFixed(4)}
            </Typography>
            <FormControl size="small">
              <Select
                value={inputs.appRateUnit}
                onChange={handleInputChange('appRateUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 100 }}
              >
                {appRateUnits.map((u) => (
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
          <Box sx={{ ...fontFormula, fontSize: 24 }}>
            AR = q / (A × 452.57)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}>
              <b>AR</b> = Application Rate (in/hr)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>q</b> = Flow Rate (gpm)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>A</b> = Area (acres)
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 13, color: '#888', mt: 4, textAlign: 'center' }}>
        Reference: Washington State University / IrrigationBox
      </Typography>
    </Paper>
  );
};

export default WaterApplicationRateCalculator; 