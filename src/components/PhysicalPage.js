import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, TextField, Button, List, ListItem, ListItemText, IconButton, Grid, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const PhysicalPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', costPrice: '', sellPrice: '', stock: '' });

  // Load products from localStorage on component mount
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.sellPrice && newProduct.stock) {
      setProducts([...products, { ...newProduct, id: new Date().getTime() }]);
      setNewProduct({ name: '', costPrice: '', sellPrice: '', stock: '' });
    } else {
      alert('Nama, Harga Jual, dan Stok harus diisi!');
    }
  };

  const updateStock = (productId, amount) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, stock: Math.max(0, Number(p.stock) + amount) } : p
    ));
  };

  const handleSellProduct = (product) => {
    if (product.stock > 0) {
      // 1. Decrease stock
      updateStock(product.id, -1);

      // 2. Record transaction
      const saleTransaction = {
        id: new Date().getTime(),
        category: 'Fisik',
        type: 'Penjualan',
        description: `Penjualan ${product.name}`,
        costPrice: product.costPrice,
        sellPrice: product.sellPrice,
        date: new Date().toISOString().split('T')[0],
      };
      const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
      localStorage.setItem('transactions', JSON.stringify([...existingTransactions, saleTransaction]));
      alert(`${product.name} terjual!`);
    } else {
      alert('Stok habis!');
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Tambah Produk Baru</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={4}><TextField label="Nama Produk" name="name" value={newProduct.name} onChange={handleNewProductChange} fullWidth /></Grid>
          <Grid item xs={6} sm={2}><TextField label="Harga Beli" name="costPrice" type="number" value={newProduct.costPrice} onChange={handleNewProductChange} fullWidth /></Grid>
          <Grid item xs={6} sm={2}><TextField label="Harga Jual" name="sellPrice" type="number" value={newProduct.sellPrice} onChange={handleNewProductChange} fullWidth /></Grid>
          <Grid item xs={6} sm={2}><TextField label="Stok Awal" name="stock" type="number" value={newProduct.stock} onChange={handleNewProductChange} fullWidth /></Grid>
          <Grid item xs={12} sm={2}><Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleAddProduct} fullWidth>Tambah</Button></Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Daftar Produk Fisik</Typography>
        <List>
          {products.map((p, index) => (
            <React.Fragment key={p.id}>
              <ListItem>
                <ListItemText
                  primary={p.name}
                  secondary={`Beli: Rp${p.costPrice || 0} / Jual: Rp${p.sellPrice} / Stok: ${p.stock}`}
                />
                <IconButton onClick={() => updateStock(p.id, -1)}><RemoveIcon /></IconButton>
                <IconButton onClick={() => updateStock(p.id, 1)}><AddIcon /></IconButton>
                <Button variant="outlined" startIcon={<ShoppingCartIcon />} onClick={() => handleSellProduct(p)} sx={{ ml: 2 }}>
                  Jual
                </Button>
              </ListItem>
              {index < products.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default PhysicalPage;
