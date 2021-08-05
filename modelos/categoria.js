const mongoose = require('mongoose');

const categoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
    } 
})


categoriaSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categoriaSchema.set('toJSON', {
    virtuals: true,
});

exports.Categoria = mongoose.model('Categoria', categoriaSchema);
