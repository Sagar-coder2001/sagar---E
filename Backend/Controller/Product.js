const { Product } = require("../Model/Product")

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const response = await product.save();
        res.status(201).json({ message: "Product created successfully", product: response });
    } catch (err) {
        console.error('Error creating product:', err);

        // Check for validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: err.errors
            });
        }

        res.status(500).json({ message: 'Error creating product', error: err.message });
    }
};


exports.fetchAllProducts = async (req, res) => {
  let condition = {};

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  // Apply category filter if provided
  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(',') } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(',') },
    });
  }

  // Apply brand filter if provided
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(',') } });
    totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(',') } });
  }

  // Apply sorting if provided
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Get total product count for pagination
  const totalDocs = await totalProductsQuery.countDocuments().exec();

  try {
    const docs = await query.exec();

    // Convert Mongoose documents to plain objects, ensuring 'id' is included
    const transformedDocs = docs.map(doc => doc.toJSON());

    // Set total count in the response headers for pagination
    res.set('X-Total-Count', totalDocs);

    // Send the transformed documents as the response
    res.status(200).json(transformedDocs);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.updateProductById = async (req, res) => {
    const { id } = req.params;
    try {
        // Find and update the product by ID
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
};
