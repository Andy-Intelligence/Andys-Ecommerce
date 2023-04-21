const express = require("express");

const router = express.Router();

const{
    getVendor,
        postOrder,
        myOrder,
        orderSummary,
        getParticularOrder,
        setOrderDeliveryStatustoTrue,
        responseAfterSuccessfulOrder,
        deleteOrder,
}
 = require('../controllers/Order');

const {
    auth,
    isAuth,
    isAdmin,
    isVendor,
    isVendorOrAdmin,
} = require("../middlewares/Auth");





router.get('/', auth, isVendorOrAdmin, getVendor)


router.post('/', auth, postOrder)


router.get('/mine', auth, myOrder)


router.post('/orderSummary', auth, isAdmin, orderSummary)


router.get('/:id', auth, getParticularOrder)


router.put('/:id/deliver', auth, setOrderDeliveryStatustoTrue)



router.put('/:id/pay', auth, responseAfterSuccessfulOrder)


router.delete('/:id', auth, isAdmin, deleteOrder)


module.exports = router