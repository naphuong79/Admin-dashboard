const router = require('express').Router();
const verifiedAdmin = require('../middleware/verifiedAdmin');
const voucherController = require('../controllers/voucherController');

router.get("/", voucherController.getAllVouchers);
router.get("/:id", voucherController.getVoucher);
router.post("/create", voucherController.createVoucher);
router.put("/update/:id", voucherController.updateVoucher);
router.delete("/delete/:id", voucherController.deleteVoucher);

module.exports = router;