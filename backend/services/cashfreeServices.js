const { Cashfree } = require('cashfree-pg');
require('dotenv').config({ quiet: true });

const cashfree = new Cashfree(
    Cashfree.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

const createCashfreeOrder = async (orderId, amount, user) => {
    const request = {
        order_amount: amount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: user.id.toString(),
            customer_phone: "9999999999"
        },
        order_meta:{
            return_url: "http://127.0.0.1:5502/frontend/expense/index.html?order_id={order_id}"
        }
    };
    const response = await cashfree.PGCreateOrder(request);
    return response.data;
};
const verifyCashfreePayment = async (orderId) => {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    return response.data;
}

module.exports={
    createCashfreeOrder, verifyCashfreePayment
}