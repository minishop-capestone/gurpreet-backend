const express = require('express');
const { getAllProducts, addProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/add', addProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
