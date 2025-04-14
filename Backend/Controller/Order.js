const { Order } = require("../Model/Order");

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.params; 
  try {
    const orders = await Order.find({user: id});
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const {id} = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const {id} = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id , req.body, {
      new : true
    })
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  try {
    let query = Order.find(); // Fetch all orders without any conditions or filters

    // Fetch all orders (without sorting or pagination)
    const docs = await query.exec();
    
    // Optionally, if you want to return the total count of orders:
    const totalDocs = await Order.countDocuments().exec(); // Use countDocuments() instead of count()

    // Set the total count of orders in the response header
    res.set('X-Total-Count', totalDocs);

    // Send all orders as JSON response
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching orders', error: err.message }); // Handle errors and provide more details
  }
};

