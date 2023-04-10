require("dotenv").config();
const axios = require("axios");
const cors = require("cors");

const RZP_CUST_ID = process.env.RZP_CUST_ID;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

const createContact = async (name) => {
    return new Promise((resolve, reject) => {
        axios
            .post("https://api.razorpay.com/v1/contacts",
                {
                    "name": name,
                    "email": "test@gmail.com",
                    "contact": "987654321",
                    "type": "vendor",
                    "reference_id": "vendor_ref_id" 
                },
                {
                    headers : {
                        "Content-Type": "application/json"
                    },
                    auth : {
                        username : API_KEY,
                        password : API_SECRET
                    }
                }
            )
            .then((resp) => {
                console.log(resp.data)
                resolve(resp.data)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
    });
}

const createFundAccount = async (contact_id, vpa_address) => {
    return new Promise((resolve, reject) => {
        axios
            .post("https://api.razorpay.com/v1/fund_accounts",
                {
                    account_type: "vpa",
                    contact_id: contact_id,
                    vpa : {
                        address : vpa_address
                    }
                },
                {
                    headers : {
                        "Content-Type": "application/json"
                    },
                    auth : {
                        username : API_KEY,
                        password : API_SECRET
                    }
                }
            )
            .then((resp) => {
                console.log(resp.data)
                resolve(resp.data)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
    });
}

const createTransfer = async (fund_acc_id, amount) => {
    return new Promise((resolve, reject) => {
        axios
            .post("https://api.razorpay.com/v1/payouts",
                {
                    account_number: RZP_CUST_ID,
                    fund_account_id: fund_acc_id,
                    amount: amount,
                    currency: "INR",
                    mode: "UPI",
                    purpose: "payout",
                    queue_if_low_balance: true
                },
                {
                    headers : {
                        "Content-Type": "application/json"
                    },
                    auth : {
                        username : API_KEY,
                        password : API_SECRET
                    }
                }
            )
            .then((resp) => {
                console.log(resp.data)
                resolve(resp.data)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
    });
}


const createPayout = async (name, vpa_address, amount) => {
    const rzp_contact = await createContact(name);
    const rzp_fundAcc = await createFundAccount(rzp_contact.id, vpa_address);
    const rzp_transfer = await createTransfer(rzp_fundAcc.id, (amount * 100));
    return rzp_transfer;
}

module.exports = createPayout