import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeLayout from './layouts/HomeLayout';
import ScanPayment from './pages/ScanPayment';
import BankTransfer from './pages/BankTransfer';
import ConfirmPayment from './pages/ConfirmPayment';
import PaymentSuccess from './pages/PaymentSuccess';
import BuyCrypto from './pages/BuyCrypto';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <HomeLayout />}></Route>
          <Route path='/qrscanner' element={ <ScanPayment />}></Route>
          <Route path='/banktransfer' element={ <BankTransfer />}></Route>
          <Route path='/confirmpayment' element={ <ConfirmPayment />}></Route>
          <Route path='/paymentsuccess' element={ <PaymentSuccess />}></Route>
          <Route path='/buycrypto' element={ <BuyCrypto />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
