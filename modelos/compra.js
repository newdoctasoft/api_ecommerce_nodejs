const mongoose = require('mongoose');

const compraSchema = mongoose.Schema({
    items: [{  //guarda un array con el id de cada orden
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required:true
    }],
    ciudad: {
        type: String,
        required: true,
    },
    pais: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: true,
        default: 'PENDIENTE',
    },
    precioTotal: {
        type: Number,
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',//model
    }, 
    fecha: {
        type: Date,
        default: Date.now,
    },
})

compraSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

compraSchema.set('toJSON', {
    virtuals: true,
});

exports.Compra = mongoose.model('Compra', compraSchema);



/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */