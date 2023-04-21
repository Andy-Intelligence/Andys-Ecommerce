const express = require('express')
const Order = '../models/Order.js';
const User = '../models/User.js';
const Product =  '../models/Product.js';
// import { isAdmin, isAuth, isSellerOrAdmin, mailgun, payOrderEmailTemplate } from '../utils.js';

const orderRouter = express.Router();


// const addToCart = async (req, res) => {
//     const qtyId = req.body || {}

//     const orders = await Order.find({ ...sellerFilter }).populate('user', 'name');
//     res.send(orders);
// };






const getVendor = async (req, res) => {
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};

    const orders = await Order.find({ ...sellerFilter }).populate('user', 'name');
    res.send(orders);
};

const postOrder = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
    const newOrder = new Order({
        seller: req.body.orderItems[0].seller,
        orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
};

const myOrder = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.send(orders);
};

const orderSummary = async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                numOrders: { $sum: 1 },
                totalSales: { $sum: '$totalPrice' },
            }
        }
    ]);

    const users = await User.aggregate([
        {
            $group: {
                _id: null,
                numUsers: { $sum: 1 },
            }
        }
    ]);

    const dailyOrders = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                orders: { $sum: 1 },
                sales: { $sum: '$totalPrice' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const productCategories = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
            },
        },
    ]);

    res.send({ users, orders, dailyOrders, productCategories });
};
const getParticularOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) return res.send(order);

    res.status(404).send({ message: 'Order not found.' });
};
const setOrderDeliveryStatustoTrue = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();
        res.send({ message: 'Order Delivered' });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
};

const responseAfterSuccessfulOrder = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'email name');
    const { id, status, update_time, email_address } = req.body;

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id,
            status,
            update_time,
            email_address,
        };

        const updatedOrder = await order.save();

        mailgun().messages().send(
            {
                from: 'Amazona <e-amazona@mg.yourdomain.com>',
                to: `${order.user.name} <${order.user.email}>`,
                subject: `New order ${order._id}`,
                html: payOrderEmailTemplate(order),
            },
            (error, body) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(body);
                }
            });

        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
};

const deleteOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        await order.remove();
        res.send({ message: 'Order Deleted' });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
};

module.exports = {
getVendor,
postOrder,
myOrder,
orderSummary,
getParticularOrder,
setOrderDeliveryStatustoTrue,
responseAfterSuccessfulOrder,
deleteOrder,
}