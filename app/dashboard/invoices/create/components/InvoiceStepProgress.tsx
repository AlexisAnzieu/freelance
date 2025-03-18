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
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative ${
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
            } ${stepIdx !== 0 ? "pl-8 sm:pl-20" : ""}`}
          >
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              {stepIdx !== 0 && (
                <div
                  className={`h-0.5 w-full ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => onStepChange(step.id)}
              className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                currentStep === step.id
                  ? "border-blue-600 bg-blue-600 text-white"
                  : currentStep > step.id
                  ? "border-blue-600 bg-white"
                  : "border-gray-300 bg-white"
              } ${
                currentStep >= step.id
                  ? "hover:bg-blue-50 cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              <span className="text-sm font-semibold">{step.id}</span>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
                {step.name}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
