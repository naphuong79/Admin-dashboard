const router = require('express').Router();
const verifiedAdmin = require('../middleware/verifiedAdmin');
const productController = require('../controllers/productController');

router.get("/", productController.getAllProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:id", productController.getProduct);
router.post("/create", productController.createProduct);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;