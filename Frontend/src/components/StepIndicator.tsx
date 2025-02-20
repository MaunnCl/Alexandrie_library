import React from 'react';
import '../styles/StepIndicator.css';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="step-indicator">
      {steps.map(stepNumber => (
        <div
          key={stepNumber}
          className={`step ${stepNumber <= currentStep ? 'active' : ''}`}
        >
          {stepNumber}
        </div>
      ))}
    </div>
  );
}

export default StepIndicator;
