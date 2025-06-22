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

const netAppUnits = [
  { label: 'in', value: 'in', toIn: 1 },
  { label: 'ft', value: 'ft', toIn: 12 },
  { label: 'mm', value: 'mm', toIn: 0.0393701 },
  { label: 'cm', value: 'cm', toIn: 0.393701 },
  { label: 'm', value: 'm', toIn: 39.3701 },
];
const areaUnits = [
  { label: 'acres', value: 'acres', toAcres: 1 },
  { label: 'hectares', value: 'hectares', toAcres: 2.47105 },
  { label: 'sq. ft', value: 'sqft', toAcres: 1 / 43560 },
  { label: 'sq. m', value: 'sqm', toAcres: 0.000247105 },
  { label: 'sq. miles', value: 'sqmiles', toAcres: 640 },
];
const hrsUnits = [
  { label: 'hours', value: 'hours' },
];
const daysUnits = [
  { label: 'days', value: 'days' },
];
const effUnits = [
  { label: '%', value: 'percent' },
  { label: 'decimal', value: 'decimal' },
];
const outputUnits = [
  { label: 'gpm', value: 'gpm', fromGpm: 1 },
  { label: 'lpm', value: 'lpm', fromGpm: 3.78541 },
  { label: 'lps', value: 'lps', fromGpm: 0.0630902 },
  { label: 'cms', value: 'cms', fromGpm: 0.0000630902 },
  { label: 'cfs', value: 'cfs', fromGpm: 1 / 448.831 },
  { label: 'acre-in/day', value: 'acreinday', fromGpm: 1 / 18.857 },
  { label: 'acre-in/hour', value: 'acreinhour', fromGpm: 1 / 452.57 },
  { label: 'acre-ft/day', value: 'acreftday', fromGpm: 1 / 226.6 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

function calculateQ({ netApp, netAppUnit, area, areaUnit, hrs, days, eff, effUnit }) {
  if (!netApp || !area || !hrs || !days || !eff) return null;
  
  const netAppConvFactor = netAppUnits.find(u => u.value === netAppUnit).toIn;
  const areaConvFactor = areaUnits.find(u => u.value === areaUnit).toAcres;
  const effValue = effUnit === 'percent' ? eff / 100 : eff;

  const netAppIn = netApp * netAppConvFactor;
  const areaAcres = area * areaConvFactor;

  if (hrs <= 0 || days <= 0 || effValue <= 0) return null;

  const Q = (27154 * netAppIn * areaAcres) / (60 * hrs * days * effValue);
  return Q;
}

function convertGpmToOutputUnit(value, unit) {
  const outputConvFactor = outputUnits.find(u => u.value === unit).fromGpm;
  return value * outputConvFactor;
}

const SystemPumpingRequirementsCalculator = () => {
  const [inputs, setInputs] = useState({
    netApp: '',
    netAppUnit: 'in',
    area: '',
    areaUnit: 'acres',
    hrs: '',
    hrsUnit: 'hours',
    days: '',
    daysUnit: 'days',
    eff: '',
    effUnit: 'percent',
    outputUnit: 'gpm',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const q = calculateQ({
      netApp: parseFloat(inputs.netApp),
      netAppUnit: inputs.netAppUnit,
      area: parseFloat(inputs.area),
      areaUnit: inputs.areaUnit,
      hrs: parseFloat(inputs.hrs),
      days: parseFloat(inputs.days),
      eff: parseFloat(inputs.eff),
      effUnit: inputs.effUnit,
    });
    if (q === null || isNaN(q)) {
      setResult(null);
      return;
    }
    const val = convertGpmToOutputUnit(q, inputs.outputUnit);
    setResult(val);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        System Pumping Requirements
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the total flow rate required to operate your irrigation system.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Net application required per week"
              type="number"
              value={inputs.netApp}
              onChange={handleInputChange('netApp')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Net Application Unit</InputLabel>
            <Select
              value={inputs.netAppUnit}
              label="Net Application Unit"
              onChange={handleInputChange('netAppUnit')}
            >
              {netAppUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Total area to be irrigated"
              type="number"
              value={inputs.area}
              onChange={handleInputChange('area')}
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
              label="Total Hours Available to Operate per Day"
              type="number"
              value={inputs.hrs}
              onChange={handleInputChange('hrs')}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Total Days Available to Operate per Week"
              type="number"
              value={inputs.days}
              onChange={handleInputChange('days')}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Irrigation Efficiency"
              type="number"
              value={inputs.eff}
              onChange={handleInputChange('eff')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Efficiency Unit</InputLabel>
            <Select
              value={inputs.effUnit}
              label="Efficiency Unit"
              onChange={handleInputChange('effUnit')}
            >
              {effUnits.map((u) => (
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
            <FormControl size="small">
              <Select
                value={inputs.outputUnit}
                onChange={handleInputChange('outputUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 120 }}
              >
                {outputUnits.map((u) => (
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
          <Box sx={{ ...fontFormula, fontSize: 24, whiteSpace: 'nowrap', overflowX: 'auto', p: 1 }}>
            Q = (27154 &times; Net_app &times; A) / (60 &times; Hrs &times; Days &times; E)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, textAlign: 'left' }}>
            <Typography sx={{ fontSize: 16 }}>
              <b>Q</b> = Total flow rate required (gpm)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>Net_app</b> = Net application per week (in)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>A</b> = Total area to be irrigated (acres)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>Hrs</b> = Hours available per day (hrs)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>Days</b> = Days available per week (days)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>E</b> = Irrigation system efficiency (decimal)
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

export default SystemPumpingRequirementsCalculator; 