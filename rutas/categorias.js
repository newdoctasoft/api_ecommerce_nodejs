const {Categoria} = require('../modelos/categoria');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoriaLista = await Categoria.find();

    if(!categoriaLista) {
        res.status(500).json({mensaje:'NO EXISTEN CATEGORIAS VIGENTES'})
    } 
    res.status(200).send(categoriaLista);
})

router.get('/:id', async(req,res)=>{
    const categoria = await Categoria.findById(req.params.id);

    if(!categoria) {
        res.status(500).json({mensaje: 'NO SE ENCONTRO CATEGORIA CON ESE ID'})
    } 
    res.status(200).send(categoria);
})



router.post('/', async (req,res)=>{
    let categoria = new Categoria({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion 
    })
    categoria = await categoria.save();

    if(!categoria)
    return res.status(400).send('LA CATEGORIA NO PUDO SER CREADA')

    res.send(categoria);
})


router.put('/:id',async (req, res)=> {
    const categoria = await Categoria.findByIdAndUpdate(
        req.params.id,
        {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion || categoria.descripcion 
        },
        { new: true}
    )

    if(!categoria)
    return res.status(400).send('LA CATEGORIA NO PUDO SER EDITADA')

    res.send(categoria);
})

router.delete('/:id', (req, res)=>{
    Categoria.findByIdAndRemove(req.params.id).then(categoria =>{
        if(categoria) {
            return res.status(200).json({mensaje: 'LA CATEGORIA FUE ELIMINADA'})
        } else {
            return res.status(404).json({mensaje: "CATEGORIA NO ENCONTRADA"})
        }
    }).catch(err=>{
       return res.status(500).json({error: err}) 
    })
})

module.exports =router;