const Order = require('../models/orderModel');
const User = require('../models/userModel')
const { createCashfreeOrder, verifyCashfreePayment } = require('../services/cashfreeServices');

const createOrder = async (req, res) => {
    try {
        const orderId = `order_${Date.now()}`;
        const amount = 1;
        const order = await Order.create({
            orderId: orderId,
            UserId: req.user.id,
            status: 'PENDING'
        });
        const cashfreeOrder = await createCashfreeOrder(
            orderId,
            amount,
            req.user
        );
        return res.status(201).json({
            message: 'Order created successfully',
            order: order,
            cashfreeOrder: cashfreeOrder
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const payments = await verifyCashfreePayment(orderId);
        console.log("PAYMENTS:", payments);
        if (payments.length === 0) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }
        const payment = payments[0];
        if (payment.payment_status === "SUCCESS") {
            await Order.update(
                {
                    status: "SUCCESSFUL"
                },
                {
                    where: {
                        orderId: orderId,
                        UserId: req.user.id
                    }
                }
            );
            await User.update(
                {
                    isPremium: true
                },
                {
                    where: {
                        id: req.user.id
                    }
                }
            );
            return res.status(200).json({
                message: "Payment successful",
                paymentStatus: "SUCCESS"
            });
        }
        if (payment.payment_status === "PENDING") {
            await Order.update(
                {
                    status: "PENDING"
                },
                {
                    where: {
                        orderId: orderId,
                        UserId: req.user.id
                    }
                }
            );

            return res.status(200).json({
                message: "Payment is pending",
                paymentStatus: "PENDING"
            });
        }

        await Order.update(
            {
                status: "FAILED"
            },
            {
                where: {
                    orderId: orderId,
                    UserId: req.user.id
                }
            }
        );

        return res.status(200).json({
            message: "Transaction failed",
            paymentStatus: "FAILED"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    createOrder, verifyPayment
};