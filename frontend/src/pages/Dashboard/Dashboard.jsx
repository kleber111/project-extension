'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { Add, Delete, Edit, Search } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import AddProductDialog from '../../components/AddProductDialog'
import api from '../../services/api' // Importando seu service

export default function Dashboard() {
  const [openDialog, setOpenDialog] = useState(false)
  const [produtos, setProdutos] = useState([])
  const [produtoEditando, setProdutoEditando] = useState(null)

  // Função pra carregar os produtos da API - coloquei dentro do useEffect
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await api.get('/')
        setProdutos(response.data)
      } catch (error) {
        console.error('erro ao carregar', error)
        //  setProdutos(Array(8).fill({
        //     nome: 'Arroz Branco 5kg',
        //     codigo: 'AR-URB-5kg',
        //     preco: 'R$4,99',
        //      estoque: '15 em estoque',
        //     }))
      }
    }

    carregarProdutos()
  }, [])

  //função reaproveitada ela salva e faz o editar
  const handleSalvarProduto = async (formData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      if (produtoEditando) {
        await api.patch(`/${produtoEditando.code}`, formData, config)
      } else {
        await api.post('/', formData, config)
      }

      const response = await api.get('/')
      setProdutos(response.data)
    } catch (error) {
      console.error('Falha ao salvar produto:', error)
    } finally {
      setOpenDialog(false)
      setProdutoEditando(null)
    }
  }

  const handleDeletarProduto = async (codigo) => {
    try {
      await api.delete(`/${codigo}`);
      const response = await api.get('/')
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/*NAVBAR DEPOIS CRIAR COMPONENTE PRA ELE*/}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          mb: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: '1.25rem',
            color: 'text.primary',
          }}
        >
          Stock Market
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            borderRadius: 1.5,
            px: 2,
            py: 1,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
          onClick={() => {
            setProdutoEditando(null)
            setOpenDialog(true)
          }}
        >
          Adicionar Produto
        </Button>
      </Box>

      {/* DEpois diminuir o tamanho ou ajsutar para ter mais filtros de repente*/}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por Produto ou CÓD..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />

        <Grid container spacing={3}>
          {produtos.map((produto, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* DEpois colcoar no background url vai depender do banckend em nest*/}
                <Box
                  sx={{
                    width: '100%',
                    height: 140,
                    bgcolor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundImage: produto.image ? `url(${import.meta.env.BACK_URL || 'http://localhost:3000'}/uploads/${produto.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                {/**  cards */}
                <CardContent sx={{
                  pt: 1.5,
                  pb: 2,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                    minHeight={54}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {produto.name || produto.nome}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        sx={{ p: 0.5, ml: 0.5 }}
                        onClick={() => {
                          setProdutoEditando(produto)
                          setOpenDialog(true)
                        }}
                      >
                        <Edit sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ p: 0.5 }}
                        onClick={() => handleDeletarProduto(produto.code || produto.codigo)}
                      >
                        <Delete sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 1,
                      fontSize: '0.8rem'
                    }}
                  >
                    {produto.code || produto.codigo}
                  </Typography>

                  <Typography
                    fontWeight="bold"
                    sx={{
                      mb: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    R$ {typeof produto.price === 'number' ? produto.price.toFixed(2) : produto.preco}
                  </Typography>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 10,
                      backgroundColor: '#CBEAFE',
                      color: '#000',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      mt: 'auto',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {produto.quantity || produto.estoque} em estoque
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <AddProductDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setProdutoEditando(null);
        }}
        onSave={handleSalvarProduto}
        produto={produtoEditando} //MEXI NO COMPONENTE PRA APROVEITAR NA EDICAO
      />
    </Box>
  )
}