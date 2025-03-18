interface Step {
  id: number;
  name: string;
}

interface InvoiceStepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function InvoiceStepProgress({
  steps,
  currentStep,
  onStepChange,
}: InvoiceStepProgressProps) {
  return (
    <nav aria-label="Progress" className="mb-8 w-1/2 mx-auto ">
      <div className="relative">
        {/* Step Indicators */}
        <ol role="list" className="relative flex justify-between">
          {steps.map((step) => (
            <li key={step.name}>
              <button
                type="button"
                onClick={() => onStepChange(step.id)}
                className="relative flex flex-col items-center"
              >
                <span
                  className={`h-8 w-8 flex items-center justify-center rounded-full border-2 transition-all duration-200 ease-in-out ${
                    currentStep > step.id
                      ? "border-blue-600 bg-blue-600 hover:bg-blue-700"
                      : currentStep === step.id
                      ? "border-blue-600 bg-blue-600 hover:bg-blue-700"
                      : "border-gray-300 bg-white"
                  } ${
                    currentStep >= step.id
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : currentStep === step.id ? (
                    <span className="text-sm font-semibold text-white">
                      {step.id}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-gray-500">
                      {step.id}
                    </span>
                  )}
                </span>
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {step.name}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
