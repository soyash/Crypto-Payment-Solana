import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BankTransfer = () => {

    const [upiObj, setUpiObj] = useState({
        name : '',
        vpa : '',
        amount : 0
    })
    const navigate = useNavigate();

    const clickHandler = (e) => {
        navigate("/confirmpayment", {
            state : upiObj
        });
    }

    const handleChange = (event) => {
        setUpiObj(prevValue => {
            return {
                ...prevValue,
                [event.target.name] : event.target.value
            }
        })
    }

    return (
      <div>
          <h5 className='form-container'>Enter recipient details</h5>
          <form className="form-group">
            <div className='form-container'>
                <input type="text" className="form-control" placeholder="Name" name="name" onChange={handleChange}/>
            </div>     
            <div className='form-container'>
                <input type="text" className="form-control" placeholder="UPI Id" name="vpa" onChange={handleChange}/>
            </div>     
            <div className='form-container'>
                <input type="text" className="form-control" placeholder="Amount" name="amount" onChange={handleChange}/>
            </div>     
            <div className="d-grid gap-2 form-container">
                <button className="btn btn-primary" type="submit" onClick={clickHandler}>Confirm</button>
            </div>
          </form>
      </div>
    )
}

export default BankTransfer