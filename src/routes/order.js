const router = require('express').Router();
const verifiedAdmin = require('../middleware/verifiedAdmin');
const orderController = require('../controllers/orderController');

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrder);
router.post("/create", orderController.createOrder);
router.put("/update/:id", orderController.updateOrder);
router.put("/update-status/:id", orderController.updateStatusOrder);
router.get("/user/:id", orderController.getOrderByUser);

module.exports = router;