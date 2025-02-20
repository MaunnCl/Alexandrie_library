import React, { useState, ChangeEvent } from 'react';
import StepIndicator from '../components/StepIndicator';
import '../styles/Register.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isUnderage, setIsUnderage] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiration, setExpiration] = useState('');
    const [cvv, setCvv] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleBirthDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputDate = new Date(e.target.value);
        const today = new Date();
        const age = today.getFullYear() - inputDate.getFullYear();
        setIsUnderage(age < 18);
        setBirthDate(e.target.value);
    };

    const canGoNextFromStep1 = () => {
        if (!email || !password || !confirmPassword) return false;
        if (password !== confirmPassword) return false;
        return true;
    };

    const canGoNextFromStep2 = () => {
        if (!firstName || !lastName || !username || !phone || !birthDate) return false;
        if (isUnderage) return false;
        return true;
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
    
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    email,
                    password
                })
            });
    
            if (response.ok) {
                setSuccess(true);
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };
    
    const showStep1 = step === 1;
    const showStep2 = step === 2;
    const showStep3 = step === 3;

    return (
        <div className="register-page">
            <div className="register-container">
                <h2 className="register-title">Create Account</h2>
                
                <StepIndicator currentStep={step} totalSteps={3} />

                <form className="register-form" onSubmit={handleSubmit}>
                    {showStep1 && (
                        <div className="step-content animate-slide">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div className="password-row">
                                <div className="password-field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Enter your password..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="password-field">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        placeholder="Confirm your password..."
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {showStep2 && (
                        <div className="step-content animate-slide">
                            <div className="two-fields-row">
                                <div className="two-fields-item">
                                    <label htmlFor="first-name">First Name</label>
                                    <input
                                        type="text"
                                        id="first-name"
                                        placeholder="Enter your first name..."
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="two-fields-item">
                                    <label htmlFor="last-name">Last Name</label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        placeholder="Enter your last name..."
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="two-fields-row">
                                <div className="two-fields-item">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Choose a username..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="two-fields-item">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="Enter your phone number..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="two-fields-row">
                                <div className="two-fields-item">
                                    <label htmlFor="birth-date">Birth Date</label>
                                    <input
                                        type="date"
                                        id="birth-date"
                                        value={birthDate}
                                        onChange={handleBirthDateChange}
                                        required
                                    />
                                    {isUnderage && (
                                        <p className="error-message">You must be 18 or older to register.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {showStep3 && (
                        <div className="step-content animate-slide">
                            <h3 className="payment-title">Payment Details</h3>
                            <label htmlFor="card-number">Card Number</label>
                            <input
                                type="text"
                                id="card-number"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                            />

                            <div className="two-fields-row">
                                <div className="two-fields-item">
                                    <label htmlFor="expiration">Expiration Date</label>
                                    <input
                                        type="text"
                                        id="expiration"
                                        placeholder="MM/YY"
                                        value={expiration}
                                        onChange={(e) => setExpiration(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="two-fields-item">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        placeholder="XXX"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="navigation-buttons">
                        {step > 1 && (
                            <button
                                type="button"
                                className="back-button"
                                onClick={prevStep}
                            >
                                Back
                            </button>
                        )}

                        {step < 3 && (
                            <button
                                type="button"
                                className="next-button"
                                onClick={nextStep}
                                disabled={
                                    (step === 1 && !canGoNextFromStep1()) ||
                                    (step === 2 && !canGoNextFromStep2())
                                }
                            >
                                Next
                            </button>
                        )}

                        {step === 3 && (
                            <button
                                type="submit"
                                className="register-button"
                                disabled={!cardNumber || !expiration || !cvv}
                            >
                                Complete Registration
                            </button>
                        )}
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p style={{ color: '#00d4ff' }}>Registration successful!</p>}

                </form>
            </div>
        </div>
    );
}

export default Register;
