import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import QRScanner from './QRScanner'


export default function ScanPayment() {

    const [showQRScanner, serShowQRScanner] = useState(false)
    const [scanResult, setScanResult] = useState('')
    const [upiObj, setUpiObj] = useState({
      name : '',
      vpa : '',
      amount : ''
    })

    const navigate = useNavigate()

    const toggleShowQRScanner = () => {
      serShowQRScanner(prevValue => !prevValue)
    }

    const parseUpiLink = (data) => {

      if(data.startsWith('upi://', 0)) {
        const vpa = data.split('pa=').pop().split('&')[0]
        const name = data.split('pn=').pop().split('&')[0]
        let amount = ''
        if(data.includes('am=')) {
          amount = data.split('am=').pop().split('&')[0]
        }
        setUpiObj({
          name : name,
          vpa : vpa,
          amount : amount
        })
        return ({
          name : name,
          vpa : vpa,
          amount : amount
        })
      }
    }

    const getUpiObj = () => {
      console.log(upiObj)
    }

    const onNewScanResult = async (decodedText, decodedResult) => {
      setScanResult(decodedText)
      const newUpiObj = parseUpiLink(decodedText)
      console.log(newUpiObj)
      var delayInMillisecondsRedirect = 1000; // 1 second
      setTimeout(function() {
        navigate("/confirmpayment", {
            state : newUpiObj
        });
      }, delayInMillisecondsRedirect);
    }

    return (
        <div className='scan-container'>
            {
              showQRScanner && <QRScanner
                fps={10}
                qrbox={250}
                disableFlip={true}
                qrCodeSuccessCallback={onNewScanResult}
              />
            }

            <button type="button" className="btn btn-primary btn-show-scanner" onClick={toggleShowQRScanner}>{showQRScanner ? 'Stop scanning' : 'Scan QR code'}</button>
        </div>
    )
}    