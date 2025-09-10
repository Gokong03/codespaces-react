import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Grid, ButtonGroup, Button, Box
} from '@mui/material';
import { subDays, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';

const RecapCard = ({ title, value }) => (
  <Paper sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h4">{`Rp${Number(value).toLocaleString('id-ID')}`}</Typography>
  </Paper>
);

const RecapPage = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('today'); // 'today', 'week', 'month', 'year'

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setAllTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    const now = new Date();
    let interval;

    switch (filter) {
      case 'week':
        interval = { start: subDays(now, 7), end: now };
        break;
      case 'month':
        interval = { start: startOfMonth(now), end: now };
        break;
      case 'year':
        interval = { start: startOfYear(now), end: now };
        break;
      case 'today':
      default:
        interval = { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date(now.setHours(23, 59, 59, 999)) };
        break;
    }

    const filtered = allTransactions.filter(t => {
      const tDate = new Date(t.date);
      return isWithinInterval(tDate, interval);
    });
    setFilteredTransactions(filtered);
  }, [filter, allTransactions]);

  const calculateMetrics = () => {
    const sales = filteredTransactions.filter(t => t.type === 'Penjualan');

    const grossRevenue = sales.reduce((acc, t) => acc + Number(t.sellPrice || 0), 0);
    const totalCost = sales.reduce((acc, t) => acc + Number(t.costPrice || 0), 0);
    const netProfit = grossRevenue - totalCost;

    return { grossRevenue, totalCost, netProfit };
  };

  const { grossRevenue, totalCost, netProfit } = calculateMetrics();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Rekap Laporan
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ButtonGroup variant="outlined" aria-label="filter-group">
          <Button onClick={() => setFilter('today')} variant={filter === 'today' ? 'contained' : 'outlined'}>Hari Ini</Button>
          <Button onClick={() => setFilter('week')} variant={filter === 'week' ? 'contained' : 'outlined'}>7 Hari</Button>
          <Button onClick={() => setFilter('month')} variant={filter === 'month' ? 'contained' : 'outlined'}>Bulan Ini</Button>
          <Button onClick={() => setFilter('year')} variant={filter === 'year' ? 'contained' : 'outlined'}>Tahun Ini</Button>
        </ButtonGroup>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RecapCard title="Omset Kotor" value={grossRevenue} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecapCard title="Total Modal" value={totalCost} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecapCard title="Laba Bersih" value={netProfit} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecapPage;
