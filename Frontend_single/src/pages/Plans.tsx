import { useNavigate } from 'react-router-dom';
import '../styles/Plans.css';

function Plans() {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    navigate('/checkout', { state: { planName } });
  };

  return (
    <div className="plans-page">
      <h1 className="plans-title">Choose Your Plan</h1>
      <p className="plans-subtitle">
        Select the best plan that suits your needs.
      </p>

      <div className="plans-container">
        <div className="plan-card">
          <h2 className="plan-name">Basic</h2>
          <p className="plan-price">$9.99 <span>/ month</span></p>
          <ul className="plan-features">
            <li>Feature A</li>
            <li>Feature B</li>
            <li>Feature C</li>
          </ul>
          <button 
            className="select-plan-button"
            onClick={() => handleSelectPlan('Basic')}
          >
            Select Basic
          </button>
        </div>

        <div className="plan-card">
          <h2 className="plan-name">Standard</h2>
          <p className="plan-price">$19.99 <span>/ month</span></p>
          <ul className="plan-features">
            <li>Everything in Basic</li>
            <li>Feature D</li>
            <li>Feature E</li>
          </ul>
          <button 
            className="select-plan-button"
            onClick={() => handleSelectPlan('Standard')}
          >
            Select Standard
          </button>
        </div>

        <div className="plan-card">
          <h2 className="plan-name">Premium</h2>
          <p className="plan-price">$29.99 <span>/ month</span></p>
          <ul className="plan-features">
            <li>Everything in Standard</li>
            <li>Feature F</li>
            <li>Priority Support</li>
          </ul>
          <button 
            className="select-plan-button"
            onClick={() => handleSelectPlan('Premium')}
          >
            Select Premium
          </button>
        </div>
      </div>
    </div>
  );
}

export default Plans;
