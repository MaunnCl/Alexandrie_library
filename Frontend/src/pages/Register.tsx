import React, { useState, ChangeEvent } from 'react';
import '../styles/Register.css';

function Register() {
  // -- Champs Étape 1 --
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // -- Champs Étape 2 --
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isUnderage, setIsUnderage] = useState(false);

  // -- Champs Étape 3 (paiement placeholder) --
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');

  // Étape du formulaire (1, 2 ou 3)
  const [step, setStep] = useState(1);

  // Vérifie l'âge
  const handleBirthDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputDate = new Date(e.target.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    setIsUnderage(age < 18);
    setBirthDate(e.target.value);
  };

  // Vérification pour activer/désactiver le bouton "Next" (Étape 1)
  const canGoNextFromStep1 = () => {
    if (!email || !password || !confirmPassword) return false;
    if (password !== confirmPassword) return false;
    return true;
  };

  // Vérification pour activer/désactiver le bouton "Next" (Étape 2)
  const canGoNextFromStep2 = () => {
    if (!firstName || !lastName || !username || !phone || !birthDate) return false;
    if (isUnderage) return false;
    return true;
  };

  // Gestion du passage d’étape
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Appel API ou autre logique...
    alert('Form submitted! (Step 3 completed)');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* ÉTAPE 1 : Email + Password */}
          <div className={`step step-1 ${step === 1 ? 'active' : ''}`}>
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

          {/* ÉTAPE 2 : Infos Personnelles */}
          <div className={`step step-2 ${step === 2 ? 'active' : ''}`}>
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

            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Choose a username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number..."
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
            {isUnderage && (
              <p className="error-message">You must be 18 or older to register.</p>
            )}
          </div>

          {/* ÉTAPE 3 : Placeholder Paiement */}
          <div className={`step step-3 ${step === 3 ? 'active' : ''}`}>
            <h3>Payment Details</h3>
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

          {/* Boutons de navigation */}
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
        </form>
      </div>
    </div>
  );
}

export default Register;
