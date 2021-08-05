const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true
    }, 
    imagen: {
        type: String,
        default: ''
    },
    imagenes: [{
        type: String
    }],
    precio : {
        type: Number,
        default:0
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required:true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },destacado: {
        type: Boolean,
        default: false,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
})

productoSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productoSchema.set('toJSON', {
    virtuals: true,
});


exports.Producto = mongoose.model('Producto', productoSchema);
