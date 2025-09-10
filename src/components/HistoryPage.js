import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, List, ListItem, ListItemText, Divider, Button, Box, IconButton
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShareIcon from '@mui/icons-material/Share';
import ReceiptModal from './ReceiptModal';

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    storedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
    setTransactions(storedTransactions);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat transaksi? Aksi ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('transactions');
      setTransactions([]);
    }
  };

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatPrice = (price) => `Rp${Number(price || 0).toLocaleString('id-ID')}`;

  const getTransactionDetails = (t) => {
    let primary = `(${t.type}) ${t.description || 'Transaksi'}`;
    let secondary = '';

    if (t.category === 'Digital') {
      const profit = t.sellPrice - t.costPrice;
      primary = `[DIGITAL] ${t.description || t.type}`;
      secondary = `Akun: ${t.account} | Jual: ${formatPrice(t.sellPrice)} | Beli: ${formatPrice(t.costPrice)} | Laba: ${formatPrice(profit)}`;
    } else if (t.category === 'Fisik') {
      const profit = t.sellPrice - t.costPrice;
      primary = `[FISIK] ${t.description}`;
      secondary = `Jual: ${formatPrice(t.sellPrice)} | Beli: ${formatPrice(t.costPrice)} | Laba: ${formatPrice(profit)}`;
    }

    return { primary, secondary };
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Riwayat Transaksi
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={handleClearHistory}
            disabled={transactions.length === 0}
          >
            Hapus Semua
          </Button>
        </Box>
        <List>
          {transactions.length > 0 ? (
            transactions.map((t, index) => {
              const { primary, secondary } = getTransactionDetails(t);
              return (
                <React.Fragment key={t.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="share" onClick={() => handleOpenModal(t)}>
                        <ShareIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={primary}
                      secondary={secondary}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 4 }}>
                      {new Date(t.date).toLocaleDateString('id-ID')}
                    </Typography>
                  </ListItem>
                  {index < transactions.length - 1 && <Divider />}
                </React.Fragment>
              );
            })
          ) : (
            <Typography sx={{ textAlign: 'center', mt: 4 }}>
              Belum ada transaksi.
            </Typography>
          )}
        </List>
      </Paper>
      <ReceiptModal open={isModalOpen} handleClose={handleCloseModal} transaction={selectedTransaction} />
    </>
  );
};

export default HistoryPage;
