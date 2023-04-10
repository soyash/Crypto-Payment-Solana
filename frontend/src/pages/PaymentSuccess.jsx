import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
    
    const navigate = useNavigate();

    const clickHandler = (e) => {
        navigate("/");
    }

    return (
        <div>
            <div className="payment-success" onClick={clickHandler}>
                <img src="/check-circle.png" alt="payment complete" />
                <h6>Payment complete</h6>
            </div>
        </div>
    )
}