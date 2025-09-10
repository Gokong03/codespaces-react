import React, { useRef } from 'react';
import {
  Modal, Box, Typography, Button, Divider
} from '@mui/material';
import html2canvas from 'html2canvas';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: '#000', // Ensure text is black for the receipt
};

const formatPrice = (price) => `Rp${Number(price || 0).toLocaleString('id-ID')}`;

const ReceiptModal = ({ open, handleClose, transaction }) => {
  const receiptRef = useRef();

  if (!transaction) return null;

  const handleShareAsPng = () => {
    if (!receiptRef.current) return;
    html2canvas(receiptRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `receipt-${transaction.id}.png`;
      link.click();
    });
  };

  const generateTxtContent = () => {
    let content = `--- STRUK TRANSAKSI ---\n`;
    content += `ID: ${transaction.id}\n`;
    content += `Tanggal: ${new Date(transaction.date).toLocaleString('id-ID')}\n`;
    content += `-----------------------\n`;
    content += `Deskripsi: ${transaction.description || transaction.type}\n`;
    content += `Kategori: ${transaction.category}\n`;
    if (transaction.category === 'Digital') {
      content += `Akun: ${transaction.account}\n`;
    }
    content += `-----------------------\n`;
    content += `Harga Jual: ${formatPrice(transaction.sellPrice)}\n`;
    content += `-----------------------\n`;
    content += `Terima kasih!\n`;
    return content;
  };

  const handleShareAsTxt = () => {
    const txtContent = generateTxtContent();
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt-${transaction.id}.txt`;
    link.click();
  };

  const profit = transaction.sellPrice - transaction.costPrice;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box ref={receiptRef} sx={{ p: 2, background: '#fff' }}>
          <Typography variant="h6" align="center">Struk Transaksi</Typography>
          <Typography variant="body2" align="center">{new Date(transaction.date).toLocaleString('id-ID')}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography><strong>ID:</strong> {transaction.id}</Typography>
          <Typography><strong>Jenis:</strong> {transaction.category} - {transaction.type}</Typography>
          <Typography><strong>Deskripsi:</strong> {transaction.description}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6"><strong>Total: {formatPrice(transaction.sellPrice)}</strong></Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" align="center" component="p">Terima kasih!</Typography>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Button onClick={handleShareAsPng}>Simpan PNG</Button>
          <Button onClick={handleShareAsTxt}>Simpan TXT</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReceiptModal;
