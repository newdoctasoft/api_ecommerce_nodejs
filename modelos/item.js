const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    cantidad: {
        type: Number,
        required: true
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
    }
})

exports.Item = mongoose.model('Item', itemSchema);

