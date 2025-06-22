import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import BackButton from './BackButton';

const netWaterUnits = [
  { label: 'mm', value: 'mm' },
  { label: 'cm', value: 'cm' },
  { label: 'in', value: 'in' },
];

const areaUnits = [
  { label: 'acres', value: 'acres' },
  { label: 'sq. in.', value: 'sqin' },
  { label: 'sq. ft.', value: 'sqft' },
  { label: 'hectares', value: 'hectares' },
  { label: 'sq. cm.', value: 'sqcm' },
  { label: 'sq. meters', value: 'sqm' },
  { label: 'sq. mile', value: 'sqmile' },
];

const flowRateUnits = [
  { label: 'lps', value: 'lps' },
  { label: 'lpm', value: 'lpm' },
  { label: 'lph', value: 'lph' },
  { label: 'gpm', value: 'gpm' },
  { label: 'gph', value: 'gph' },
  { label: 'gpd', value: 'gpd' },
  { label: 'cfs', value: 'cfs' },
  { label: 'cfm', value: 'cfm' },
  { label: 'cu. m/hr', value: 'cumhr' },
  { label: 'cu. yd/min', value: 'cuym' },
  { label: 'mgd', value: 'mgd' },
  { label: 'acre-in/day', value: 'acreinday' },
  { label: 'acre-in/hr', value: 'acreinhr' },
  { label: 'acre-ft/day', value: 'acrefday' },
  { label: 'cms', value: 'cms' },
];

const setTimeUnits = [
  { label: 'hr', value: 'hr' },
  { label: 'min', value: 'min' },
];

function convertNetWaterToInches(value, unit) {
  switch (unit) {
    case 'mm': return value * 0.0393701;
    case 'cm': return value * 0.393701;
    case 'in': return value;
    default: return value;
  }
}

function convertAreaToAcres(value, unit) {
  switch (unit) {
    case 'acres': return value;
    case 'sqin': return value / 6272640;
    case 'sqft': return value / 43560;
    case 'hectares': return value * 2.47105;
    case 'sqcm': return value / 40468564.224;
    case 'sqm': return value / 4046.86;
    case 'sqmile': return value * 640;
    default: return value;
  }
}

function convertFlowRateToGpm(value, unit) {
  switch (unit) {
    case 'gpm': return value;
    case 'lps': return value * 15.8503;
    case 'lpm': return value * 0.264172;
    case 'lph': return value * 0.00440287;
    case 'gph': return value / 60;
    case 'gpd': return value / 1440;
    case 'cfs': return value * 448.831;
    case 'cfm': return value * 7.48052;
    case 'cumhr': return value * 4.40287;
    case 'cuym': return value * 201.974;
    case 'mgd': return value * 694.444;
    case 'acreinday': return value * 27154;
    case 'acreinhr': return value * 651696;
    case 'acrefday': return value * 271540;
    case 'cms': return value * 15850.3;
    default: return value;
  }
}

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

const IrrigationTimesCalculator = () => {
  const [inputs, setInputs] = useState({
    netWater: '',
    netWaterUnit: netWaterUnits[0].value,
    systemEfficiency: 80,
    irrigatedArea: '',
    areaUnit: areaUnits[0].value,
    flowRate: '',
    flowRateUnit: flowRateUnits[0].value,
    setTimeUnit: setTimeUnits[0].value
  });

  const [result, setResult] = useState(null);

  const handleNumberInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  useEffect(() => {
    calculateSetTime();
  }, [inputs]);

  const calculateSetTime = () => {
    const netWaterInches = convertNetWaterToInches(inputs.netWater, inputs.netWaterUnit);
    const areaAcres = convertAreaToAcres(inputs.irrigatedArea, inputs.areaUnit);
    const flowGpm = convertFlowRateToGpm(inputs.flowRate, inputs.flowRateUnit);
    const efficiency = inputs.systemEfficiency / 100;
    
    if (netWaterInches <= 0 || areaAcres <= 0 || flowGpm <= 0 || efficiency <= 0) {
      setResult(null);
      return;
    }
    
    let setTimeHr = (netWaterInches * areaAcres * 43560) / (96.3 * flowGpm * efficiency);
    let finalTime = setTimeHr;
    if (inputs.setTimeUnit === 'min') {
      finalTime = setTimeHr * 60;
    }
    setResult(finalTime);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Set Irrigation Times
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Use this form to determine the set time required to fulfill a given water application, irrigation area, and flow rate.
      </Typography>
      <Box sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Net Water Application"
              type="number"
              value={inputs.netWater}
              onChange={handleNumberInputChange('netWater')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Unit</InputLabel>
            <Select
              value={inputs.netWaterUnit}
              label="Unit"
              onChange={handleInputChange('netWaterUnit')}
            >
              {netWaterUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="System Efficiency (%)"
              type="number"
              value={inputs.systemEfficiency}
              onChange={handleNumberInputChange('systemEfficiency')}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Irrigated Area"
              type="number"
              value={inputs.irrigatedArea}
              onChange={handleNumberInputChange('irrigatedArea')}
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
              {result.toFixed(2)}
            </Typography>
            <FormControl size="small">
              <Select
                value={inputs.setTimeUnit}
                onChange={handleInputChange('setTimeUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 80 }}
              >
                {setTimeUnits.map((u) => (
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
            T = (D × A × 43560) / (96.3 × Q × E)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}><b>T</b> = Set Time (hr)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>D</b> = Net water application (in)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>A</b> = Irrigated area (acres)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q</b> = Flow Rate (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>E</b> = System efficiency (as a decimal)</Typography>
          </Box>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 13, color: '#888', mt: 4, textAlign: 'center' }}>
        Reference: Washington State University / IrrigationBox
      </Typography>
    </Paper>
  );
};

export default IrrigationTimesCalculator; 