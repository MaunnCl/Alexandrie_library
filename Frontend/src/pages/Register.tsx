import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '../components/StepIndicator';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const totalSteps = 2;

  const canGoNextFromStep1 = () =>
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    password === confirmPassword;

  const canFinishRegistration = () =>
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    phone.trim().length > 0 &&
    birthDate.trim().length > 0;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleBirthDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (!canFinishRegistration()) return;
  
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
          password,
          phone,
          birthDate,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating user');
      }
      const createdUser = await response.json();
      localStorage.setItem('userId', createdUser.id);
      navigate('/plans');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>

        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        {error && <p className="error-message">{error}</p>}

        <form className="register-form" onSubmit={handleSubmit}>
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
                <input
                  type="email"
                  id="email"
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
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
                    <input
                      type="text"
                      id="first-name"
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
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <label htmlFor="birth-date">Birth Date</label>
                <input
                  type="date"
                  id="birth-date"
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="navigation-buttons">
            {step > 1 && (
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
            )}

            {step < totalSteps && (
              <button
                type="button"
                className="next-button"
                onClick={nextStep}
                disabled={step === 1 && !canGoNextFromStep1()}
              >
                Next
              </button>
            )}

            {step === totalSteps && (
              <button
                type="submit"
                className="register-button"
                disabled={!canFinishRegistration()}
              >
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
