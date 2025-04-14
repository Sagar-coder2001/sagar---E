
const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema(
    {
        products: { type: [Schema.Types.Mixed], required: true },
        totalAmount: { type: Number },
        totalItems: { type: Number },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        selectpaymentmode: { type: String },
        paymentStatus: { type: String, default: 'pending' },
        status: { type: String, default: 'pending' },
        selectaddress: { type: Schema.Types.Mixed },
      },
      { timestamps: true }
)

orderSchema.virtual('id').get(function () {
    return this._id.toString();  // Ensure it's a string representation of the ObjectId
  });
 
  orderSchema.set('toJSON', {
    virtuals: true, // Make sure the virtual field 'id' is included when converting to JSON
    versionKey: false, // Don't include the version key (__v)
    transform: function (doc, ret) {
      delete ret._id;  // Remove the _id field from the JSON representation
    },
  });

exports.Order = mongoose.model('Order' , orderSchema)