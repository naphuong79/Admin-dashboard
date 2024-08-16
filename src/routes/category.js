const router = require('express').Router();
const verifiedAdmin = require('../middleware/verifiedAdmin');
const categoryController = require('../controllers/categoryController');

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);
router.post("/create", categoryController.createCategory);
router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;