import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Box, Card, CardContent, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import BackButton from './BackButton';

// Data tables from reference
const lTable = {
  25: 4, 50: 2, 75: 1.5, 100: 1, 125: 0.87, 150: 0.75, 175: 0.62, 200: 0.5,
};
const spTable = {
  '1/2': { 40: 6, 45: 6.5, 50: 7, 60: 7.5 },
  '5/8': { 40: 11, 45: 12, 50: 12.5, 60: 14 },
  '3/4': { 40: 18, 45: 19, 50: 20, 60: 22 },
};

const hoseSizes = Object.keys(spTable);
const pressures = Object.keys(spTable['1/2']);
const lengths = Object.keys(lTable);

const flowUnits = [
  { label: 'gpm', value: 'gpm', fromGpm: v => v },
  { label: 'lps', value: 'lps', fromGpm: v => v * 0.06309 },
  { label: 'lpm', value: 'lpm', fromGpm: v => v * 3.78541 },
  { label: 'cfs', value: 'cfs', fromGpm: v => v * 0.002228 },
  { label: 'cfm', value: 'cfm', fromGpm: v => v * 0.133681 },
];
const volumeUnits = [
  { label: 'gal', value: 'gal', toGal: v => v },
  { label: 'pints', value: 'pints', toGal: v => v * 0.125 },
  { label: 'quarts', value: 'quarts', toGal: v => v * 0.25 },
  { label: 'ml', value: 'ml', toGal: v => v * 0.000264172 },
  { label: 'l', value: 'l', toGal: v => v * 0.264172 },
  { label: 'ft³', value: 'ft3', toGal: v => v * 7.48052 },
];
const timeUnits = [
  { label: 'min', value: 'min', fromMin: v => v },
  { label: 'hr', value: 'hr', fromMin: v => v / 60 },
  { label: 'days', value: 'days', fromMin: v => v / 1440 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

const GardenHoseFlowRateTimeCalculator = () => {
  // State for Flow Rate Calculator
  const [flowInputs, setFlowInputs] = useState({
    size: '5/8',
    pressure: '50',
    length: '50',
  });
  const [flowResultGpm, setFlowResultGpm] = useState(null);
  const [flowOutputUnit, setFlowOutputUnit] = useState('gpm');

  // State for Fill Time Calculator
  const [timeInputs, setTimeInputs] = useState({ volume: '' });
  const [timeResultMin, setTimeResultMin] = useState(null);
  const [volumeUnit, setVolumeUnit] = useState('gal');
  const [timeOutputUnit, setTimeOutputUnit] = useState('min');

  // Flow Rate Calculation
  useEffect(() => {
    const { size, pressure, length } = flowInputs;
    if (size && pressure && length) {
      const SP = spTable[size]?.[pressure];
      const L = lTable[length];
      if (SP && L) {
        setFlowResultGpm(SP * L);
      } else {
        setFlowResultGpm(null);
      }
    }
  }, [flowInputs]);

  // Fill Time Calculation
  useEffect(() => {
    if (flowResultGpm > 0 && timeInputs.volume) {
      const volGal = volumeUnits.find(u => u.value === volumeUnit).toGal(Number(timeInputs.volume));
      setTimeResultMin(volGal / flowResultGpm);
    } else {
      setTimeResultMin(null);
    }
  }, [flowResultGpm, timeInputs, volumeUnit]);

  const handleFlowInputChange = (field) => (event) => {
    setFlowInputs(prev => ({ ...prev, [field]: event.target.value }));
  };
  
  const handleTimeInputChange = (field) => (event) => {
    setTimeInputs(prev => ({ ...prev, [field]: event.target.value }));
  };
  
  const convertedFlowResult = flowResultGpm !== null ? flowUnits.find(u => u.value === flowOutputUnit).fromGpm(flowResultGpm) : null;
  const convertedTimeResult = timeResultMin !== null ? timeUnits.find(u => u.value === timeOutputUnit).fromMin(timeResultMin) : null;

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">Garden Hose Flow Rate and Time</Typography>
      <Typography gutterBottom align="center" sx={{ mb: 4, ...fontText }}>
        The amount of water flow from a garden hose and minutes to supply that amount of water are determined below, based on the hose size and its supply pressure.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Flow Rate Calculator Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ ...fontSection, mb: 2 }}>Garden Hose Flow Rate Calculator</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><FormControl fullWidth><InputLabel>Hose Size</InputLabel><Select value={flowInputs.size} label="Hose Size" onChange={handleFlowInputChange('size')}>{hoseSizes.map(s => <MenuItem key={s} value={s}>{s} in</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={12}><FormControl fullWidth><InputLabel>Hose Supply Pressure</InputLabel><Select value={flowInputs.pressure} label="Hose Supply Pressure" onChange={handleFlowInputChange('pressure')}>{pressures.map(p => <MenuItem key={p} value={p}>{p} psi</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={12}><FormControl fullWidth><InputLabel>Hose Length</InputLabel><Select value={flowInputs.length} label="Hose Length" onChange={handleFlowInputChange('length')}>{lengths.map(l => <MenuItem key={l} value={l}>{l} feet</MenuItem>)}</Select></FormControl></Grid>
              </Grid>
              {convertedFlowResult !== null && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography sx={{...fontSection, mb: 1}}>Water Flow Rate:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography sx={{ ...fontFormula, fontSize: 28, m: 0 }}>{convertedFlowResult.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
                    <FormControl size="small"><Select value={flowOutputUnit} onChange={e => setFlowOutputUnit(e.target.value)} sx={{ fontWeight: 600, color: '#8cb43a' }}>{flowUnits.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}</Select></FormControl>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Fill Time Calculator Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ ...fontSection, mb: 2 }}>Water Flow Time Calculator</Typography>
              <FormControl fullWidth>
                <TextField label="Volume" type="number" value={timeInputs.volume} onChange={handleTimeInputChange('volume')} InputProps={{
                  endAdornment: <Select value={volumeUnit} onChange={e => setVolumeUnit(e.target.value)} sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>{volumeUnits.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}</Select>
                }}/>
              </FormControl>
              {convertedTimeResult !== null && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography sx={{ ...fontSection, mb: 1 }}>Time:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography sx={{ ...fontFormula, fontSize: 28, m: 0 }}>{convertedTimeResult.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
                    <FormControl size="small"><Select value={timeOutputUnit} onChange={e => setTimeOutputUnit(e.target.value)} sx={{ fontWeight: 600, color: '#8cb43a' }}>{timeUnits.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}</Select></FormControl>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Equations Section */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ ...fontSection, mb: 2 }}>The Equations</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center">Water Flow Rate</Typography>
            <Box sx={{ ...fontFormula, width: '100%', textAlign: 'center', mb: 1 }}>Q = SP ⋅ L</Box>
            <Typography sx={{ ...fontText, ml: 2 }}><b>Q</b> = Water flow rate from the end of the hose (gpm)</Typography>
            <Typography sx={{ ...fontText, ml: 2 }}><b>SP</b> = An arbitrary number from hose size and supply pressure</Typography>
            <Typography sx={{ ...fontText, ml: 2 }}><b>L</b> = An arbitrary number to account for hose size</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center">Water Flow Time</Typography>
            <Box sx={{ ...fontFormula, width: '100%', textAlign: 'center', mb: 1 }}>Time = Vol / Q</Box>
            <Typography sx={{ ...fontText, ml: 2 }}><b>Time</b> = Time to fill the specified volume (min)</Typography>
            <Typography sx={{ ...fontText, ml: 2 }}><b>Vol</b> = Volume needed (gal)</Typography>
            <Typography sx={{ ...fontText, ml: 2 }}><b>Q</b> = Flow rate from the garden hose (gpm)</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ mt: 2 }} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography align="center">To determine the value for <b>L</b>, use this table.</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table size="small"><TableHead><TableRow><TableCell>Length (ft)</TableCell><TableCell>Value</TableCell></TableRow></TableHead>
                <TableBody>{Object.entries(lTable).map(([key, val]) => <TableRow key={key}><TableCell>{key}</TableCell><TableCell>{val}</TableCell></TableRow>)}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography align="center">To determine the value for <b>SP</b>, use this table.</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table size="small"><TableHead><TableRow><TableCell>Size (in)</TableCell>{pressures.map(p => <TableCell key={p}>{p} (psi)</TableCell>)}</TableRow></TableHead>
                <TableBody>{hoseSizes.map(size => <TableRow key={size}><TableCell>{size}</TableCell>{pressures.map(p => <TableCell key={p}>{spTable[size][p]}</TableCell>)}</TableRow>)}</TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
      <Typography sx={{ fontSize: 13, color: '#888', mt: 4, textAlign: 'center' }}>
        Reference: Washington State University / IrrigationBox
      </Typography>
    </Paper>
  );
};

export default GardenHoseFlowRateTimeCalculator; 