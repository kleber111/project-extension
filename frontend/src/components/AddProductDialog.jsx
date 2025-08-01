import {
    Box,
    Button,
    Dialog, 
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Avatar,
    IconButton
} from '@mui/material'
import { useState, useEffect } from 'react'
import { AddAPhoto } from '@mui/icons-material'

const initialState = {
    nome: '',
    codigo: '',
    preco: '',
    estoque: '',
    imagem: null 
}

export default function AddProductDialog({ open, onClose, onSave, produto }) {
    const [formData, setFormData] = useState(initialState);
    const [previewImagem, setPreviewImagem] = useState(null)

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        })) 
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({...prev, imagem: file}))
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImagem(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSave = () => {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.nome);
        formDataToSend.append('code', formData.codigo);
        formDataToSend.append('price', Number(formData.preco));
        formDataToSend.append('quantity', Number(formData.estoque));
        if (formData.imagem) {
            formDataToSend.append('image', formData.imagem);
        }

        onSave(formDataToSend)
        onClose()
    }

    useEffect(() => {
        if(open) {
            //A LOGICA AQUI E SE O PRODUTO EXISTE E EDIÇÃO ENTAO SETA O PRODUTO VINDO DO COMPONENTE PRINCIPAL SE NAO FOR FICA INITIAL STATE
            if(produto) {
                setFormData({
                    nome: produto.name || produto.nome || '',
                    codigo: produto.code || produto.codigo || '',
                    preco: produto.price?.toString() || produto.preco || '',
                    estoque: produto.quantity?.toString() || produto.estoque || '',
                    imagem: null
                })
                
                if (produto.image) {
                    setPreviewImagem(`http://localhost:3000/uploads/${produto.image}`)
                } else {
                    setPreviewImagem(null)
                }
            } else {
                setFormData(initialState)
                setPreviewImagem(null) 
            }
        }
    }, [open, produto]) 

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {/* esse dialog vai ser reaproveitado tbm para o editar fica melhor assim e evita criar um so pro editar*/}
            <DialogTitle>{produto ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
            <DialogContent>
          
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <label htmlFor="upload-image">
                    <input
                        accept="image/*"
                        id="upload-image"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <IconButton component="span">
                        <Avatar 
                            src={previewImagem} 
                            sx={{ width: 100, height: 100 }}
                        >
                            {!previewImagem && <AddAPhoto fontSize="large" />}
                        </Avatar>
                    </IconButton>
                </label>
            </Box>

            <TextField
                name= 'nome'
                label= 'Nome do Produto'
                value= {formData.nome}
                onChange= {handleInputChange}
                fullWidth
                sx= {{mb:2, mt:1}}    
            />
            <TextField 
                name= 'codigo'
                label= 'Código'
                value= {formData.codigo}
                onChange= {handleInputChange}
                fullWidth
                sx= {{mb:2}}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField 
                    name= 'preco'
                    label= 'Preço'
                    value= {formData.preco}
                    onChange= {handleInputChange}
                    fullWidth
                    type="number" 
                />
                <TextField
                    name= 'estoque'
                    label= 'Estoque'
                    value= {formData.estoque}
                    onChange= {handleInputChange}
                    fullWidth
                    type="number" 
                />
            </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSave}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}