import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Paper, Typography } from '@mui/material';

const DigitalPage = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    account: '',
    type: 'Penjualan',
    costPrice: '',
    sellPrice: '',
    description: '',
  });
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
    if (storedAccounts.length === 0) {
      // If no accounts are set, provide some defaults and save them
      const defaultAccounts = ['BRI', 'BCA', 'Mandiri', 'E-Money'];
      localStorage.setItem('accounts', JSON.stringify(defaultAccounts));
      setAccounts(defaultAccounts);
    } else {
      setAccounts(storedAccounts);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // 1. Get existing transactions from localStorage
    const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    // 2. Add new transaction
    const newTransaction = { ...formData, id: new Date().getTime(), category: 'Digital' };
    existingTransactions.push(newTransaction);
    // 3. Save back to localStorage
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));
    // 4. Optionally, give user feedback (e.g., an alert or snackbar)
    alert('Transaksi berhasil disimpan!');
    // 5. Clear the form
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      account: '',
      type: 'Penjualan',
      costPrice: '',
      sellPrice: '',
      description: '',
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Transaksi Digital
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            name="date"
            label="Tanggal"
            type="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Akun Saldo</InputLabel>
            <Select name="account" value={formData.account} label="Akun Saldo" onChange={handleChange}>
              {accounts.map((acc) => (
                <MenuItem key={acc} value={acc}>
                  {acc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Jenis</InputLabel>
            <Select name="type" value={formData.type} label="Jenis" onChange={handleChange}>
              <MenuItem value="Penjualan">Penjualan</MenuItem>
              <MenuItem value="Pembelian">Pembelian</MenuItem>
              <MenuItem value="Transfer Masuk">Transfer Masuk</MenuItem>
              <MenuItem value="Transfer Keluar">Transfer Keluar</MenuItem>
              <MenuItem value="Lainnya">Lainnya</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="costPrice"
            label="Harga Beli"
            type="number"
            value={formData.costPrice}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="sellPrice"
            label="Harga Jual"
            type="number"
            value={formData.sellPrice}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Keterangan (opsional)"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Simpan
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="secondary" onClick={handleClear} fullWidth>
            Bersihkan
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DigitalPage;
