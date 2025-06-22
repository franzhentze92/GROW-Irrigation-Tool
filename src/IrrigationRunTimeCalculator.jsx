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

const intervalUnits = [
  { label: 'days', value: 1 },
  { label: 'hr', value: 1 / 24 },
];

const cropWaterUseUnits = [
  { label: 'in/day', value: 1 },
  { label: 'mm/day', value: 1 / 25.4 },
  { label: 'cm/day', value: 1 / 2.54 },
  { label: 'in/month', value: 1 / 30 },
  { label: 'mm/month', value: 1 / (25.4 * 30) },
  { label: 'cm/month', value: 1 / (2.54 * 30) },
];

const appRateUnits = [
  { label: 'in/hr', value: 1 },
  { label: 'in/day', value: 1 / 24 },
  { label: 'mm/hr', value: 1 / 25.4 },
  { label: 'mm/day', value: 1 / (25.4 * 24) },
  { label: 'cm/hr', value: 1 / 2.54 },
  { label: 'cm/day', value: 1 / (2.54 * 24) },
];

const efficiencyUnits = [
  { label: '%', value: 0.01 },
  { label: 'decimal', value: 1 },
];

const outputUnits = [
  { label: 'min', value: 1 },
  { label: 'hr', value: 1 / 60 },
  { label: 'days', value: 1 / (60 * 24) },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

const IrrigationRunTimeCalculator = () => {
  const [inputs, setInputs] = useState({
    interval: '',
    intervalUnit: intervalUnits[0].value,
    waterUse: '',
    waterUseUnit: cropWaterUseUnits[0].value,
    appRate: '',
    appRateUnit: appRateUnits[0].value,
    efficiency: '',
    efficiencyUnit: efficiencyUnits[0].value,
    outputUnit: outputUnits[0].value
  });

  const handleNumberInputChange = (field) => (event) => {
    setInputs(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Calculate run time
  let result = null;
  const valid = inputs.interval && inputs.waterUse && inputs.appRate && inputs.efficiency && Number(inputs.efficiency) !== 0;
  if (valid) {
    // Convert all to base units: days, in/day, in/hr, decimal
    const I = parseFloat(inputs.interval) * inputs.intervalUnit;
    const W = parseFloat(inputs.waterUse) * inputs.waterUseUnit;
    const AR = parseFloat(inputs.appRate) * inputs.appRateUnit;
    const E = parseFloat(inputs.efficiency) * inputs.efficiencyUnit;
    if (AR > 0 && E > 0) {
      const T_min = (60 * I * W) / (AR * E);
      const outFactor = inputs.outputUnit;
      const T_out = T_min * outFactor;
      result = T_out;
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigation Run Time Calculator
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Use this calculator to determine the length of time that an irrigation system must run to apply enough water to replace the water lost to evapotranspiration.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Watering Interval"
              type="number"
              value={inputs.interval}
              onChange={handleNumberInputChange('interval')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Interval Unit</InputLabel>
            <Select
              value={inputs.intervalUnit}
              label="Interval Unit"
              onChange={handleInputChange('intervalUnit')}
            >
              {intervalUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Crop Water Use"
              type="number"
              value={inputs.waterUse}
              onChange={handleNumberInputChange('waterUse')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Water Use Unit</InputLabel>
            <Select
              value={inputs.waterUseUnit}
              label="Water Use Unit"
              onChange={handleInputChange('waterUseUnit')}
            >
              {cropWaterUseUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Application Rate"
              type="number"
              value={inputs.appRate}
              onChange={handleNumberInputChange('appRate')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Application Rate Unit</InputLabel>
            <Select
              value={inputs.appRateUnit}
              label="Application Rate Unit"
              onChange={handleInputChange('appRateUnit')}
            >
              {appRateUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Irrigation Efficiency"
              type="number"
              value={inputs.efficiency}
              onChange={handleNumberInputChange('efficiency')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Efficiency Unit</InputLabel>
            <Select
              value={inputs.efficiencyUnit}
              label="Efficiency Unit"
              onChange={handleInputChange('efficiencyUnit')}
            >
              {efficiencyUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Output Unit</InputLabel>
            <Select
              value={inputs.outputUnit}
              label="Output Unit"
              onChange={handleInputChange('outputUnit')}
            >
              {outputUnits.map((u) => (
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
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: '#8cb43a', fontSize: 24 }}>
              {outputUnits.find(u => u.value === inputs.outputUnit)?.label || inputs.outputUnit}
            </Typography>
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
            T = (60 × I × W) / (AR × E)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}>
              <b>T</b> = The time the irrigation system needs to run (hrs)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>I</b> = The watering interval of the system (day)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>W</b> = Crop Water Use (in/day)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>AR</b> = Application Rate of the system (in/hr)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>E</b> = The efficiency of the irrigation system (as a decimal)
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

export default IrrigationRunTimeCalculator; 