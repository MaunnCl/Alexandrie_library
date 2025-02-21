import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    const canGoNextFromStep1 = () => email && password && confirmPassword && password === confirmPassword;
    const canGoNextFromStep2 = () => firstName && lastName && username && phone && birthDate && !isUnderage;
    const canGoNextFromStep3 = () => cardNumber.length === 16 && expiration.length === 5 && cvv.length === 3;

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="register-page">
            <div className="register-container">
                <h2 className="register-title">Create Account</h2>

                <StepIndicator currentStep={step} totalSteps={3} />

                <form className="register-form">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4 }}
                                className="step-content"
                            >
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                                <div className="password-row">
                                    <div className="password-field">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>

                                    <div className="password-field">
                                        <label htmlFor="confirm-password">Confirm Password</label>
                                        <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4 }}
                                className="step-content"
                            >
                                <div className="two-fields-row">
                                    <div className="two-fields-item">
                                        <label htmlFor="first-name">First Name</label>
                                        <input type="text" id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                    </div>

                                    <div className="two-fields-item">
                                        <label htmlFor="last-name">Last Name</label>
                                        <input type="text" id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="two-fields-row">
                                    <div className="two-fields-item">
                                        <label htmlFor="username">Username</label>
                                        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    </div>

                                    <div className="two-fields-item">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                    </div>
                                </div>

                                <label htmlFor="birth-date">Birth Date</label>
                                <input type="date" id="birth-date" value={birthDate} onChange={handleBirthDateChange} required />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4 }}
                                className="step-content"
                            >
                                <label htmlFor="card-number">Card Number</label>
                                <input type="text" id="card-number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />

                                <div className="two-fields-row">
                                    <div className="two-fields-item">
                                        <label htmlFor="expiration">Expiration Date</label>
                                        <input type="text" id="expiration" placeholder="MM/YY" value={expiration} onChange={(e) => setExpiration(e.target.value)} required />
                                    </div>
                                    <div className="two-fields-item">
                                        <label htmlFor="cvv">CVV</label>
                                        <input type="text" id="cvv" placeholder="XXX" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="navigation-buttons">
                        {step > 1 && <button type="button" className="back-button" onClick={prevStep}>Back</button>}
                        {step < 3 && <button type="button" className="next-button" onClick={nextStep} disabled={(step === 1 && !canGoNextFromStep1()) || (step === 2 && !canGoNextFromStep2())}>Next</button>}
                        {step === 3 && <button type="submit" className="register-button" disabled={!canGoNextFromStep3()}>Complete Registration</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
