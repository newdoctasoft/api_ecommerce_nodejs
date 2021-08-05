const { Producto } = require('../modelos/producto');
const express = require('express');
const { Categoria } = require('../modelos/categoria');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var filetypes = /jpeg|jpg|png/; 
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());  
        let uploadError = new Error('invalid image type');

        if (extname) {
            uploadError = null;
          }

        
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        var filetypes = /jpeg|jpg/; 
        var extension = path.extname(file.originalname).toLowerCase(); 

        const fileName = file.originalname.split(' ').join('-');  
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

 

const subirImagen = multer({ storage: storage });



router.get(`/`, async (req, res) => {
    let filtrar = {};
    if (req.query.categorias) {
        filtrar = { categorias: req.query.categorias.split(',') };
    }
    console.log(filtrar);
    const productoLista = await Producto.find(filtrar).populate('categoria');

    if (!productoLista) {
        res.status(500).json({ mensaje:'NO HAY PRODUCTOS VIGENTES' });
    }
    res.send(productoLista);
});


 
 


router.get(`/:id`, async (req, res) => {
    const producto = await Producto.findById(req.params.id).populate('categoria');

    if (!producto) {
        res.status(500).json({ mensaje:'EL PRODUCTO NO EXISTE' });
    }
    res.send(producto);
});

router.post(`/`, subirImagen.single('imagen'), async (req, res) => {
    const categoria = await Categoria.findById(req.body.categoria);
    if (!categoria) return res.status(400).send('CATEGORIA INVALIDA');

    const file = req.file;
    if (!file) return res.status(400).send('DEBE INSERTAR UNA IMAGEN');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let producto = new Producto({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion, 
        imagen: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232" 
        precio: req.body.precio,
        categoria: req.body.categoria,
        stock: req.body.stock ,
        destacado: req.body.destacado 
    });

    producto = await producto.save().catch(error=>res.json(error));

    if (!producto) return res.status(500).send('EL PRODUCTO NO PUDO SER CREADO');

    res.send(producto);
});

router.put('/:id', subirImagen.single('imagen'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('EL ID DEL PRODUCTO ES INCORRECTO');
    }
    const categoria = await Categoria.findById(req.body.categoria);
    if (!categoria) return res.status(400).send('LA CATEGORIA ES INCORRECTA');

    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(400).send('PRODUCTO NO ENCONTRADO');

    const file = req.file;
    let imagenPath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagenPath = `${basePath}${fileName}`;
    } else {
        imagenPath = producto.imagen;
    }

    const productoEditado = await Producto.findByIdAndUpdate(
        req.params.id,
        { 
            nombre: req.body.nombre,
            descripcion: req.body.descripcion, 
            imagen: imagenPath,
            precio: req.body.precio,
            categoria: req.body.categoria,
            stock: req.body.stock ,
            destacado: req.body.destacado 

        },
        { new: true }
    );

    if (!productoEditado) return res.status(500).send('EL PRODUCTO NO PUDO SER EDITADO');

    res.send(productoEditado);
});

router.delete('/:id', (req, res) => {
    Producto.findByIdAndRemove(req.params.id)
        .then((producto) => {
            if (producto) {
                return res.status(200).json({ 
                    mensaje: 'PRODUCTO ELIMINADO!'
                });
            } else {
                return res.status(404).json({ mensaje: 'PRODUCTO NO ENCONTRADO' });
            }
        })
        .catch((err) => {
            return res.status(500).json({error: err });
        });
});

router.get(`/get/cantidad`, async (req, res) => {
    const productoCantidad = await Producto.countDocuments((cantidad) => cantidad);

    if (!productoCantidad) {
        res.status(500).json({mensaje:'NO HAY PRODUCTOS CARGADOS'});
    }
    res.send({
        cantidad: productoCantidad
    });
});

router.get(`/get/destacado/:cantidad`, async (req, res) => {
    const cantidad = req.params.cantidad ? req.params.cantidad : 0;
    const productos = await Producto.find({ destacado: true }).limit(+cantidad);

    if (!productos) {
        res.status(500).json({ mensaje:'SUCEDIO UN ERROR'});
    }
    res.send(productos);
});





router.put('/galeria-imagenes/:id', subirImagen.array('imagenes', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('EL CODIGO INGRESADO ES INCORRECTO');
    }
    const files = req.files;
    let imagenesPath = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagenesPath.push(`${basePath}${file.filename}`);
        });
    }

    const producto = await Producto.findByIdAndUpdate(
        req.params.id,
        {
            imagenes: imagenesPath
        },
        { new: true }
    );

    if (!producto) return res.status(500).send('NO POSEE GALERIA DE IMAGENES');

    res.send(producto);
});

module.exports = router;
