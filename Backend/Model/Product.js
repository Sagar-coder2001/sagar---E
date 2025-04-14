
const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({ 
    // id: { type : String , required: true, unique: true},
    title: { type : String, required: true, unique: true},
    description: { type : String, required: true},
    discountPercentage: { type: Number, min:[1, 'wrong min discount'], max:[99, 'wrong max discount']},
    price: { type: Number, min:[1, 'wrong min price'], max:[10000, 'wrong max price']},
    rating: { type: Number, min:[0, 'wrong min rating'], max:[5, 'wrong max price'], default:0},
    stock: { type: Number, min:[0, 'wrong min stock'], default:0},
    brand: { type : String, required: true},
    category: { type : String, required: true},
    thumbnail: { type : String, default: 'https://pictures.kartmax.in/live/inside/800x800/sites/aPfvUDpPwMn1ZadNKhP7/product-images/8905745204992/660/KHSH001033_1.jpg'},
    images:{ type : [String], required: true},
    colors:{ type : [Schema.Types.Mixed] },
    sizes:{ type : [Schema.Types.Mixed]},
    highlights:{ type : [String] },
    discountPrice: { type: Number},
    deleted: { type : Boolean, default: false},
})

productSchema.virtual('id').get(function () {
    return this._id.toString();  // Ensure it's a string
});

// toJSON options to handle transformations when converting to JSON
productSchema.set('toJSON', {
    virtuals: true,  // Ensure virtuals are included
    versionKey: false,
    transform: function (doc, ret) {
        // We don't need to delete _id manually here, virtual 'id' will handle it
        delete ret._id;  // Optionally remove _id from the response if needed
    }
});

exports.Product = mongoose.model('Product' , productSchema)