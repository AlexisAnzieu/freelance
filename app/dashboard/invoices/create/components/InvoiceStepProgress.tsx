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
    <nav aria-label="Progress" className="mb-6 w-1/2 mx-auto">
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
                  className={`h-7 w-7 flex items-center justify-center rounded-full border-2 transition-colors cursor-pointer ${
                    currentStep > step.id
                      ? "border-[#2383e2] bg-[#2383e2] hover:bg-[#1a73d4]"
                      : currentStep === step.id
                      ? "border-[#2383e2] bg-[#2383e2] hover:bg-[#1a73d4]"
                      : "border-[#e8e8e8] bg-white hover:bg-[#f7f6f3]"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg
                      className="h-4 w-4 text-white"
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
                    <span className="text-xs font-medium text-white">
                      {step.id}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#9b9a97]">
                      {step.id}
                    </span>
                  )}
                </span>
                <span className="mt-1.5 text-xs font-medium text-[#37352f]">
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
