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
  { label: 'gph', value: 'gph', toGph: v => v },
  { label: 'lph', value: 'lph', toGph: v => v * 0.264172 },
  { label: 'gpm', value: 'gpm', toGph: v => v * 60 },
  { label: 'lps', value: 'lps', toGph: v => v * 951.019 },
];
const spacingUnits = [
  { label: 'in', value: 'in', toIn: v => v },
  { label: 'ft', value: 'ft', toIn: v => v * 12 },
  { label: 'cm', value: 'cm', toIn: v => v * 0.393701 },
  { label: 'mm', value: 'mm', toIn: v => v * 0.0393701 },
  { label: 'm', value: 'm', toIn: v => v * 39.3701 },
];
const appRateUnits = [
  { label: 'in/hr', value: 'inhr', fromInHr: v => v },
  { label: 'mm/hr', value: 'mmhr', fromInHr: v => v * 25.4 },
  { label: 'in/day', value: 'inday', fromInHr: v => v * 24 },
  { label: 'mm/day', value: 'mmday', fromInHr: v => v * 25.4 * 24 },
  { label: 'cm/hr', value: 'cmhr', fromInHr: v => v * 2.54 },
  { label: 'cm/day', value: 'cmday', fromInHr: v => v * 2.54 * 24 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateDripAppRate({ flow, flowUnit, row, rowUnit, emit, emitUnit, appRateUnit }) {
  if (!flow || !row || !emit) return null;
  const Qe = flowUnits.find(u => u.value === flowUnit).toGph(Number(flow));
  const Eff = 0.95; // Per WSU reference
  const Rowx = spacingUnits.find(u => u.value === rowUnit).toIn(Number(row));
  const Emity = spacingUnits.find(u => u.value === emitUnit).toIn(Number(emit));
  if (Qe <= 0 || Rowx <= 0 || Emity <= 0) return null;
  const PR_inhr = 231 * Qe * Eff / (Rowx * Emity);
  const outConv = appRateUnits.find(u => u.value === appRateUnit).fromInHr;
  return outConv(PR_inhr);
}

const DripLineApplicationRateCalculator = () => {
  const [inputs, setInputs] = useState({
    flow: '',
    flowUnit: 'gph',
    row: '',
    rowUnit: 'in',
    emit: '',
    emitUnit: 'in',
    appRateUnit: 'inhr',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    const res = calculateDripAppRate(inputs);
    setResult(res);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Drip Line Application Rate
      </Typography>
      <Typography gutterBottom align="center" sx={{ mb: 4, ...fontText }}>
        Use this form to calculate the water application rate of drip irrigation lines (tape, tubing) given the flow rate from individual emitters, the spacing of the emitters along the drip line, and the spacing between the drip lines.
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <FormControl fullWidth>
            <TextField
              label="Emitter flow"
              type="number"
              value={inputs.flow}
              onChange={handleInputChange('flow')}
              InputProps={{
                endAdornment: (
                  <Select
                    value={inputs.flowUnit}
                    onChange={handleInputChange('flowUnit')}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, minWidth: 100 }}
                  >
                    {flowUnits.map((u) => (
                      <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                    ))}
                  </Select>
                )
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth>
            <TextField
              label="Emitter spacing along the line"
              type="number"
              value={inputs.emit}
              onChange={handleInputChange('emit')}
              InputProps={{
                endAdornment: (
                  <Select
                    value={inputs.emitUnit}
                    onChange={handleInputChange('emitUnit')}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, minWidth: 100 }}
                  >
                    {spacingUnits.map((u) => (
                      <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                    ))}
                  </Select>
                )
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}>
          <FormControl fullWidth>
            <TextField
              label="Distance between drip lines"
              type="number"
              value={inputs.row}
              onChange={handleInputChange('row')}
              InputProps={{
                endAdornment: (
                  <Select
                    value={inputs.rowUnit}
                    onChange={handleInputChange('rowUnit')}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, minWidth: 100 }}
                  >
                    {spacingUnits.map((u) => (
                      <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                    ))}
                  </Select>
                )
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      {result !== null && (
        <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ ...fontSection, mb: 1 }} align="center">
            Application Rate:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, justifyContent: 'center' }}>
            <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            <FormControl size="small">
              <Select
                value={inputs.appRateUnit}
                onChange={handleInputChange('appRateUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 120 }}
              >
                {appRateUnits.map((u) => (
                  <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ ...fontSection, mb: 2 }} align="center">
          The Equation
        </Typography>
        <Typography sx={{ ...fontText, mb: 2, textAlign: 'center' }}>
          This calculator uses this equation to determine the Application Rate of a drip line irrigation system.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, alignItems: 'center', p: 2, background: '#f5f5f5', borderRadius: 2 }}>
          <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 24, mr: 1 }}>PR = 231</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 24 }}>Q<sub>e</sub> × Eff</Typography>
            <Box sx={{ borderTop: '2px solid #222', width: '100%' }} />
            <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 24 }}>Row<sub>x</sub> × Emit<sub>y</sub></Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            where:
          </Typography>
          <Box sx={{ display: 'inline-block', textAlign: 'left', mb: 2 }}>
            <Typography sx={{ fontSize: 16 }}><b>PR</b> = Precipitation rate (in/hr)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q<sub>e</sub></b> = Drip emitter flow rate (gal/hr)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Eff</b> = Irrigation efficiency (decimal) (use 0.95 for drip)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Row<sub>x</sub></b> = Distance between drip rows (lines) (in)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Emit<sub>y</sub></b> = Emitter spacing (in)</Typography>
          </Box>
          <Typography sx={{ fontSize: 14, color: '#888' }}>
            Reference: Washington State University
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 13, color: '#888', mt: 4, textAlign: 'center' }}>
        Reference: Washington State University / IrrigationBox
      </Typography>
    </Paper>
  );
};

export default DripLineApplicationRateCalculator; 