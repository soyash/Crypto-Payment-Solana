import { useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from 'axios';

window.Buffer = window.Buffer || require("buffer").Buffer;

const connection = new Connection("https://api.devnet.solana.com");
const SOL_ACCOUNT_TO_WATCH = new PublicKey("9o13FAL2BZDyUor6nDUZsXCpHXLzHQrhdTh2FmH7VKan");
const USDC_ACCOUNT_TO_WATCH = new PublicKey("A7WBCkvxYP1zHrFH9vnRGbZ6M93G4Myo8VidTyzpkmx2");

const AccountInfo = () => {

    const [solBalance, setSolBalance] = useState('');
    const [usdcBalance, setUsdcBalance] = useState('');
    const [solInINR, setsolInINR] = useState('');
    const [usdcInINR, setUsdcInINR] = useState('');

    const [selectedAsset, setSelectedAsset] = useState('SOL');

    useEffect(() => {
        const getBal = async (address) => {
            let bal =  await connection.getBalance(address)
            setSolBalance((bal / LAMPORTS_PER_SOL).toString())
        }
        getBal(SOL_ACCOUNT_TO_WATCH)
        
        const getBalanceUSDC = async (address) => {
            const bal = await connection.getTokenAccountBalance(address)
            setUsdcBalance(bal.value.uiAmount)
        }
        getBalanceUSDC(USDC_ACCOUNT_TO_WATCH)

    }, [solBalance, usdcBalance]);

    const getSOLINR = async (sym) => {
        let TOKEN_IN_INR = await axios
            .get(`https://min-api.cryptocompare.com/data/price?fsym=${sym}&tsyms=USD,INR`)
            .then((res) => (res.data.INR))
        
            setsolInINR(TOKEN_IN_INR);
    }
    getSOLINR('SOL');

    const getUSDCINR = async (sym) => {
        let TOKEN_IN_INR = await axios
            .get(`https://min-api.cryptocompare.com/data/price?fsym=${sym}&tsyms=USD,INR`)
            .then((res) => (res.data.INR))
        
            setUsdcInINR(TOKEN_IN_INR);
    }
    getUSDCINR('USDC');
    
    const accountInfoStyles = {
        minWidth : '20rem',
        maxWidth : '20rem'
    }

    return (
        <div>
            <div className='account-info'>
                <div className="card border-primary mb-3" style={accountInfoStyles}>
                  <div className="card-body">
                      <img src={selectedAsset === 'SOL' ? "/SOL.png" : "/USDC.png"} className='card-crypto-img' alt="dropdown menu"/>
                      <h4 className="card-title card-balance-crypto">{selectedAsset === 'SOL' ? solBalance : usdcBalance} {selectedAsset}</h4>
                      <p className="card-text card-balance-fiat">{
                        selectedAsset === 'SOL' ? (solBalance * solInINR) : (usdcBalance * usdcInINR)
                      } INR</p>
                  </div>
                </div>
            </div>
            
            <div className='available-assets'>
                <div className="alert alert-dismissible alert-light" onClick={() => setSelectedAsset('SOL')}>
                    <img src="/SOL.png" className='card-crypto-img' alt='asset-logo' />
                    <strong>{solBalance} SOL</strong>
                </div>
                <div className="alert alert-dismissible alert-light" onClick={() => setSelectedAsset('USDC')}>
                    <img src="/USDC.png" className='card-crypto-img' alt='asset-logo'/>
                    <strong>{usdcBalance} USDC</strong>
                </div>
            </div>
        </div>

    )
}

export default AccountInfo