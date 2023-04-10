require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const createPayout = require("./razorPay");

const router = new express.Router();
const PORT = process.env.PORT || 3000


app.use(cors());
app.use(express.json());
app.use(router);

router.get('/api', (req, res) => {
    res.json({'hello':'world'});
})

router.post('/api/postData', async (req, res) => {
    let upiObj = req.body;
    let name = upiObj.name;
    let vpa_address = upiObj.vpa_address;
    let amount = upiObj.amount;
    createPayout(name, vpa_address, amount);
    res.json({'POST':'Success'});
})

app.listen(PORT, () => {
    console.log(`Server start at port no ${PORT}`)
})