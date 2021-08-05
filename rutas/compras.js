const {Compra} = require('../modelos/compra');
const express = require('express');
const { Item } = require('../modelos/item');
const router = express.Router();

 
///// LISTAR

router.get(`/`, async (req, res) =>{
    const compraListado = await Compra.find().populate('usuario', 'nombre').sort({'fecha': -1});  //une con el usuario , muestra nombre //ordena mayor menor
  
   if(!compraListado) {
       res.status(500).json({mensaje:'NO HAY COMPRAS'})
   } 
   res.send(compraListado);
})



////////// BUSCAR ID 

router.get(`/:id`, async (req, res) =>{
    const compra = await Compra.findById(req.params.id)
    .populate('usuario', 'nombre')
    .populate({ 
        path: 'items', populate: {
            path : 'producto', populate: 'categoria'} 
        });

    if(!compra) {
        res.status(500).json({mensaje:'COMPRA NO ENCONTRADA'})
    } 
    res.send(compra);
})

 

  


// INSERTAR PRODUCTO

router.post('/', async (req,res)=>{
    const itemsCompraId = Promise.all(req.body.items.map(async (item) =>{
        let itemNuevo = new Item({
            cantidad: item.cantidad,
            producto: item.producto
        })

        itemNuevo = await itemNuevo.save();

        return itemNuevo._id;
    }))
    const itemsCompraIdNuevo =  await itemsCompraId; 

    const preciosTotales = await Promise.all(itemsCompraIdNuevo.map(async (itemCompraId)=>{
        const itemCompra = await Item.findById(itemCompraId).populate('Producto', 'precio');
        console.log(itemCompra);
        const precioTotal = itemCompra.producto.precio * itemCompra.cantidad;
        return precioTotal
    }))//retorna un arreglo de enteros
  
     const precioTotal1 = preciosTotales;
     console.log(precioTotal1);
    const precioTotal = preciosTotales.reduce((a,b) => a +b , 0); //suma el arreglo de enteros
    console.log(precioTotal); 

    let compra = new Compra({
        items: itemsCompraIdNuevo, 
        ciudad: req.body.ciudad, 
        pais: req.body.pais,
        telefono: req.body.telefono,
        estado: req.body.estado,
        precioTotal: 111,
        usuario: req.body.usuario,
    })
    compra = await compra.save();

    if(!compra)
    return res.status(400).send('LA COMPRA NO PUDO SER CREADA')

    res.send(compra);
})



///////// EDITAR ESTADO COMPRA


router.put('/:id',async (req, res)=> {
    const compra = await Compra.findByIdAndUpdate(
        req.params.id,
        {
            estado: req.body.estado
        },
        { new: true}
    )

    if(!compra)
    return res.status(400).send('LA COMPRA NO PUDO SER ACTUALIZADA')

    res.send(compra);
})


/////////// ELIMINAR

  
router.delete('/:id', (req, res)=>{
    Compra.findByIdAndRemove(req.params.id).then(async compra =>{
        if(compra) {
            await compra.items.map(async item => {
                await Item.findByIdAndRemove(item)
            })
            return res.status(200).json({mensaje:'COMPRA ELIMINADA'})
        } else {
            return res.status(404).json({mensaje: "COMPRA NO ENCONTRADA"})
        }
    }).catch(err=>{
       return res.status(500).json({error: err}) 
    })
})





//////// LISTAR TOTAL PRECIO

router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})



//////////// CANTIDAD COMPRAS

router.get(`/get/cantidad`, async (req, res) =>{
    const compraCantidad = await Compra.countDocuments((cantidad) => cantidad)

    if(!compraCantidad) {
        res.status(500).json({mensaje:'NO HAY COMPRAS'})
    } 
    res.send({
        cantidad: compraCantidad
    });
})





/////////// BUSCAR COMPRA POR USUARIO

router.get(`/get/usuario/:id`, async (req, res) =>{
    const usuarioCompraListado = await Compra.find({usuario: req.params.id}).populate({ 
        path: 'items', populate: {
            path : 'producto', populate: 'categoria'} 
        }).sort({'fecha': -1});

    if(!usuarioCompraListado) {
        res.status(500).json({mensaje:'NO EXISTEN COMPRAS'})
    } 
    res.send(usuarioCompraListado);
})

  


module.exports =router;