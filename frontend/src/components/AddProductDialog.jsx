import {
    Box,
    Button,
    Dialog, 
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'
import { useState, useEffect } from 'react'

const initialState = {
    nome: '',
    codigo: '',
    preco: '',
    estoque: '',
}

export default function AddProductDialog({ open, onClose}) {
    const [formData, setFormData] = useState(initialState);

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        })) 
    }

    const handleSave = () => {
        console.log('Dados a serem salvos: ', formData)
        onClose()
    }

    useEffect(() => {
        if(open) {
            setFormData(initialState)
        }
    }, [open])



    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Adicionar Produto</DialogTitle>
            <DialogContent>
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
                />
                <TextField
                    name= 'estoque'
                    label= 'Estoque'
                    value= {formData.estoque}
                    onChange= {handleInputChange}
                    fullWidth
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