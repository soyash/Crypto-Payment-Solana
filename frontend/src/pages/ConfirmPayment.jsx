import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import * as bs58 from 'bs58';
import { Connection,  Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransferCheckedInstruction } from '@solana/spl-token';

// setup
const WSS_ENDPOINT = 'wss://crimson-sly-energy.solana-devnet.discover.quiknode.pro/1c323bd264ffee775c142a669e1e04f5fb08804e/'; // replace with your URL
const HTTP_ENDPOINT = 'https://crimson-sly-energy.solana-devnet.discover.quiknode.pro/1c323bd264ffee775c142a669e1e04f5fb08804e/'; // replace with your URL
const connection = new Connection(HTTP_ENDPOINT, { wsEndpoint: WSS_ENDPOINT });

const BASE_URL = 'https://backendrendercors.onrender.com';

const secret_key = process.env.REACT_APP_WALLET_SECRET_KEY;
const keypair = Keypair.fromSecretKey(bs58.decode(secret_key));

const receiverPubkey = new PublicKey('xUTqzYf4c7cZ6spRCLWhF6MXASVs6jtzc84XKnZLuF8');

const getPrice = async (sym) => {
  let TOKEN_IN_INR = await axios
      .get(`https://min-api.cryptocompare.com/data/price?fsym=${sym}&tsyms=USD,INR`)
      .then((res) => (res.data.INR))
  
  return TOKEN_IN_INR;
}

const INRAmountToCOIN = async (amt, sym) => {
  let TOKEN_IN_INR = await getPrice(sym);
  let INR_IN_TOKEN = (1 / TOKEN_IN_INR);

  let TOKEN_TO_SEND = (amt * INR_IN_TOKEN);
  console.log(`Token to be sent: ${TOKEN_TO_SEND}`);
  return TOKEN_TO_SEND;
}

const sendSol = async (solAmount) => {
  // Replace fromWallet with your public/secret keypair, wallet must have funds to pay transaction fees.
  const fromWallet = keypair;
  const toWallet = receiverPubkey;
  const solToSend = solAmount;
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toWallet,
      lamports: Math.ceil(solToSend * LAMPORTS_PER_SOL),
    })
  );
  console.log(await connection.sendTransaction(transaction, [fromWallet]));
}

const sendUsdc = async (usdcAmount) => {
  const fromTokenAccount = new PublicKey('A7WBCkvxYP1zHrFH9vnRGbZ6M93G4Myo8VidTyzpkmx2')
  const toTokenAccount = new PublicKey('F7Dbjh9hiSCzEDogk9MBG1bYTWdRmUkmrAZtMa19o5f2')
  const mintPubKey = new PublicKey('FaRCZAtfjpHkiKoj1gw6P6G1qK7iLSBPvNHwkhznq2SE')

  let tx = new Transaction()
  tx.add(
    createTransferCheckedInstruction(
      fromTokenAccount,
      mintPubKey,
      toTokenAccount,
      keypair.publicKey,
      Math.ceil(usdcAmount * (10**6)),
      6
    )
  )
  console.log(`txhash: ${await connection.sendTransaction(tx, [keypair])}`);
}

const postData = async (data) => {
  await axios.post(`${BASE_URL}/api/postData`, {
    name: data.name,
    vpa_address: data.vpa,
    amount: data.amount
  })
  .then(res => console.log(res))
  .catch(err => console.log(err));
}

const solListener = async (upiObj) => {
  console.log("Listening for change in SOL...");
  const ACCOUNT_TO_WATCH = new PublicKey('xUTqzYf4c7cZ6spRCLWhF6MXASVs6jtzc84XKnZLuF8');
  const subscriptionId = await connection.onAccountChange(
      ACCOUNT_TO_WATCH,
      (updatedAccountInfo) => {
          console.log(`SOL listener triggered.. ${JSON.stringify(upiObj)}`)
          console.log(`updateAccountInfo object: `, updatedAccountInfo);
          //console.log(`New Account Balance:`, updatedAccountInfo.lamports / LAMPORTS_PER_SOL, ' SOL');
          postData(upiObj)
      },
      "confirmed"
  );
  console.log('Starting web socket, subscription ID: ', subscriptionId);
}

const usdcListener = async (upiObj) => {
  console.log("Listening for change in SOL...");
  const ACCOUNT_TO_WATCH = new PublicKey('F7Dbjh9hiSCzEDogk9MBG1bYTWdRmUkmrAZtMa19o5f2');
  const subscriptionId = await connection.onAccountChange(
      ACCOUNT_TO_WATCH,
      (updatedAccountInfo) => {
          console.log(`USDC listener triggered.. ${JSON.stringify(upiObj)}`)
          console.log(`updateAccountInfo object: `, updatedAccountInfo);
          //console.log(`New Account Balance:`, updatedAccountInfo.lamports / LAMPORTS_PER_SOL, ' SOL');
          postData(upiObj)
      },
      "confirmed"
  );
  console.log('Starting web socket, subscription ID: ', subscriptionId);
}


// component
const ConfirmPayment = (props) => {
    
    const [amountState, setAmountState] = useState(0);
    const [paymentToken, setPaymentToken] = useState('SOL')
    const location = useLocation();

    console.log(location)
    const navigate = useNavigate();


    let nameInitial = location.state.name.slice(0,1).toUpperCase();

    const handleChange = (event) => {
        setAmountState(event.target.value);
    }


    const makePayment = async () => {
        let data = {
            name : location.state.name,
            vpa : location.state.vpa,
            amount : (location.state.amount === "" || location.state.amount === 0) ? amountState : location.state.amount,
        }

        const tokens_to_send = await INRAmountToCOIN(data.amount, paymentToken)
        
        var delayInMilliseconds = 1000; // 1 seconds
        setTimeout(function() {
          if (paymentToken === 'SOL') {
            solListener(data)
          }
          else if (paymentToken === 'USDC') {
            usdcListener(data)
          }
        }, delayInMilliseconds)

        var delayInMillisecondsTransac = 3000; // 3 seconds
        setTimeout(function() {
          if (paymentToken === 'SOL') {
            sendSol(tokens_to_send)
          }
          else if (paymentToken === 'USDC') {
            sendUsdc(tokens_to_send)
          }
        }, delayInMillisecondsTransac);

        var delayInMillisecondsRedirect = 5000; // 5 seconds
        setTimeout(function() {
          navigate("/paymentsuccess");
        }, delayInMillisecondsRedirect);
    }
    

    return (
        <div className='confirm-payment'>
            <div className="circle">
                {nameInitial}
            </div>
            <div>
                <h6>paying {location.state.name}</h6>
            </div>
            <div className='amt-container'>
              <div><img src="/Rupee.png" alt="" /></div>
              {
                  (location.state.amount === "" || location.state.amount === 0) ? 
                      <input type="text" className="form-control form-control-lg amt-input" placeholder="0" name="amount" onChange={handleChange}/> : 
                      <div className="amt-div">{location.state.amount}</div>
              }
            </div>

            <select 
              id="selectToken"
              className='currency-select'
              value={paymentToken}
              onChange={(e) => {
                const selectedPaymentToken = e.target.value
                setPaymentToken(selectedPaymentToken)
              }}
            >
              <option className='dropdown-item' value="SOL">SOL</option>
              <option className='dropdown-item' value="USDC">USDC</option>
            </select>

            <button type="button" className="btn btn-primary btn-bottom-right" onClick={makePayment}><img src="/Arrow.png" alt="arrow" /></button>

        </div>
    )
}

export default ConfirmPayment