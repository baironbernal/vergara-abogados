import { useState } from "react";

export function useSteps(totalSteps = 1) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    console.log("Going next from step", currentStep);
    setCurrentStep((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
  };

  const back = () => {
    console.log("Going back from step", currentStep);
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const reset = () => {
    console.log("Resetting steps to 0");
    setCurrentStep(0);
  };

  return {
    currentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    next,
    back,
    reset,
  };
}