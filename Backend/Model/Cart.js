
const mongoose = require('mongoose');
const {Schema} = mongoose;

const cartSchema = new Schema({
    quantity: { type : Number, required: true},
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
    user:{ type: Schema.Types.ObjectId, ref: 'User', required: true},
    size: { type : Schema.Types.Mixed},
    color: { type : Schema.Types.Mixed},
})

cartSchema.virtual('id').get(function () {
    return this._id.toString();  // Ensure it's a string
});

 
cartSchema.set('toJSON', {
    virtuals: true,  // Ensure virtuals are included
    versionKey: false,
    transform: function (doc, ret) {
        // We don't need to delete _id manually here, virtual 'id' will handle it
        delete ret._id;  // Optionally remove _id from the response if needed
    }
});

exports.Cart = mongoose.model('Cart' , cartSchema)