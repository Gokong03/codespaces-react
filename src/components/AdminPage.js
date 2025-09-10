import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, TextField, Button, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AdminPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState('');

  // Load accounts from localStorage on component mount
  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || ['BRI', 'BCA', 'Mandiri', 'E-Money'];
    setAccounts(storedAccounts);
  }, []);

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleAddAccount = () => {
    if (newAccount && !accounts.includes(newAccount)) {
      setAccounts([...accounts, newAccount]);
      setNewAccount('');
    }
  };

  const handleDeleteAccount = (accountToDelete) => {
    setAccounts(accounts.filter(acc => acc !== accountToDelete));
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Kelola Akun Saldo
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <TextField
          label="Nama Akun Baru"
          value={newAccount}
          onChange={(e) => setNewAccount(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddAccount}
        >
          Tambah
        </Button>
      </div>
      <Typography variant="h6" gutterBottom>
        Daftar Akun
      </Typography>
      <List>
        {accounts.map((account) => (
          <ListItem
            key={account}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAccount(account)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={account} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AdminPage;
