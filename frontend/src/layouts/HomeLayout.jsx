import React from 'react';
import { NavLink } from 'react-router-dom';

import AccountInfo from '../pages/AccountInfo';

const HomeLayout = () => {

    return (
        <div>
            <div className="profile-header">
                <nav className="navbar navbar-light bg-light">
                  <div className="container-fluid">
                    <a className="navbar-brand" href="/">Cpay</a>
                    <div id="navbarColor03">
                      <form className="d-flex">
                        <img src="/profile.png" alt="profile" className="profile-img"></img>
                      </form>
                    </div>
                  </div>
                </nav>
            </div>

            <AccountInfo />
            
            <div>
                <div className='link-container'>
                    <div className='link-width'>
                        <div className="card border-secondary mb-3">
                          <div className="card-body">
                            <img src="/RupeeL.png" alt="Bank" className='link-img'></img> 
                          </div>
                        </div>
                        <NavLink to='/buycrypto' className='link'>Buy crypto</NavLink>
                    </div>
                    <div className='link-width'>
                        <div className="card border-secondary mb-3">
                          <div className="card-body">
                            <img src="/QR.png" alt="QR" className='link-img'></img>
                          </div>
                        </div>
                        <NavLink to='qrscanner' className='link'>Scan QR code</NavLink>
                    </div>
                    <div className='link-width'>
                        <div className="card border-secondary mb-3">
                          <div className="card-body">
                            <img src="/Bank.png" alt="Bank" className='link-img'></img> 
                          </div>
                        </div>
                        <NavLink to='banktransfer' className='link'>Bank transfer</NavLink>
                    </div>
                </div>
                <div className='link-container'>
                    
                </div>
            </div>
        </div>
    )
}

export default HomeLayout