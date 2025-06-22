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

const capacityUnits = [
  { label: 'GPM', value: 'gpm' },
  { label: 'LPS', value: 'lps' },
];

const waterNeedsUnits = [
  { label: 'in/day', value: 'in/day' },
  { label: 'mm/day', value: 'mm/day' },
];

const timeUnits = [
  { label: 'Hours', value: 'hr' },
  { label: 'Minutes', value: 'min' },
  { label: 'Seconds', value: 'sec' },
];

const areaUnits = [
  { label: 'Square Feet', value: 'sq. ft' },
  { label: 'Acres', value: 'acres' },
  { label: 'Hectares', value: 'hectares' },
  { label: 'Square Meters', value: 'sq. meters' },
  { label: 'Square Yards', value: 'sq. yd' },
  { label: 'Square Kilometers', value: 'sq. km' },
  { label: 'Square Miles', value: 'sq. mile' },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

const IrrigatableAreaCalculator = () => {
  const [inputs, setInputs] = useState({
    systemCapacity: '',
    waterNeeds: '',
    operationHours: '',
    systemEfficiency: 75,
    capacityUnit: capacityUnits[0].value,
    waterNeedsUnit: waterNeedsUnits[0].value,
    operationHoursUnit: timeUnits[0].value,
    areaUnit: areaUnits[0].value
  });

  const [result, setResult] = useState(null);

  const handleNumberInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs(prev => ({
      ...prev,
      [field]: field === 'systemEfficiency' ? Number(value) : Number(value)
    }));
  };

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  useEffect(() => {
    calculateArea();
  }, [inputs]);

  const calculateArea = () => {
    const { systemCapacity, waterNeeds, operationHours, systemEfficiency } = inputs;
    
    if (!systemCapacity || !waterNeeds || !operationHours || systemEfficiency <= 0) {
      setResult(null);
      return;
    }

    // Convert all units to consistent base units
    let capacityInGpm = systemCapacity;
    if (inputs.capacityUnit === 'lps') {
      capacityInGpm = systemCapacity * 15.85; // Convert L/s to GPM
    }

    let waterNeedsInInches = waterNeeds;
    if (inputs.waterNeedsUnit === 'mm/day') {
      waterNeedsInInches = waterNeeds * 0.0393701; // Convert mm to inches
    }

    let hours = operationHours;
    if (inputs.operationHoursUnit === 'min') {
      hours = operationHours / 60;
    } else if (inputs.operationHoursUnit === 'sec') {
      hours = operationHours / 3600;
    }

    const efficiencyDecimal = systemEfficiency / 100;

    // Formula: Area (sq ft) = (96.25 * S * hrs * E) / Wn
    const area = (96.25 * capacityInGpm * hours * efficiencyDecimal) / waterNeedsInInches;

    // Convert to selected area unit
    let finalArea = area;
    switch (inputs.areaUnit) {
      case 'acres':
        finalArea = area / 43560; // 1 acre = 43,560 sq ft
        break;
      case 'hectares':
        finalArea = area / 107639; // 1 hectare = 107,639 sq ft
        break;
      case 'sq. meters':
        finalArea = area * 0.092903; // 1 sq ft = 0.092903 sq meters
        break;
      case 'sq. yd':
        finalArea = area / 9; // 1 sq yd = 9 sq ft
        break;
      case 'sq. km':
        finalArea = area * 0.000000092903; // 1 sq ft = 0.000000092903 sq km
        break;
      case 'sq. mile':
        finalArea = area * 0.0000000358701; // 1 sq ft = 0.0000000358701 sq miles
        break;
      default:
        finalArea = area; // sq. ft
    }

    setResult(finalArea);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigatable Area
      </Typography>
      <Typography gutterBottom sx={{ ...fontText, mb: 4 }} align="center">
        Calculate the land area that can be irrigated with a given flow of water. The minimum system capacity is the available water from the supply, and water needs is the peak crop water requirement during a specific time period.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="System Capacity (Supply)"
              type="number"
              value={inputs.systemCapacity}
              onChange={handleNumberInputChange('systemCapacity')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Capacity Unit</InputLabel>
            <Select
              value={inputs.capacityUnit}
              label="Capacity Unit"
              onChange={handleInputChange('capacityUnit')}
            >
              {capacityUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Water Needs"
              type="number"
              value={inputs.waterNeeds}
              onChange={handleNumberInputChange('waterNeeds')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Water Needs Unit</InputLabel>
            <Select
              value={inputs.waterNeedsUnit}
              label="Water Needs Unit"
              onChange={handleInputChange('waterNeedsUnit')}
            >
              {waterNeedsUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Operation Hours Per Day"
              type="number"
              value={inputs.operationHours}
              onChange={handleNumberInputChange('operationHours')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Time Unit</InputLabel>
            <Select
              value={inputs.operationHoursUnit}
              label="Time Unit"
              onChange={handleInputChange('operationHoursUnit')}
            >
              {timeUnits.map((u) => (
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
                value={inputs.areaUnit}
                onChange={handleInputChange('areaUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 120 }}
              >
                {areaUnits.map((u) => (
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
            A = (96.25 &times; S &times; hrs &times; E) / Wn
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, textAlign: 'left' }}>
            <Typography sx={{ fontSize: 16 }}>
              <b>A</b> = Irrigatable Area (sq. ft)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>S</b> = Minimum system capacity, or supply (gpm)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>Wn</b> = Water needs (in/day)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>hrs</b> = Operation hours per day (hrs)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>E</b> = System Efficiency (as a decimal)
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

export default IrrigatableAreaCalculator; 