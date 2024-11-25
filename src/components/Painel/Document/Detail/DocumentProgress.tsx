import { AlertCircleIcon, Check, CircleAlert, Dot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Document } from "./DocumentsDetails";

interface DocumentProgressProps {
	documents: Document[];
	currentStep: number;
	onStepChange: (step: number) => void;
	completedSteps: boolean[]; // Add this prop
}

export function DocumentProgress({
	documents,
	currentStep,
	onStepChange,
	completedSteps,
}: DocumentProgressProps) {
	return (
		<div className="md:w-6/12 rounded-lg bg-gray-100 md:p-4 pl-1 pt-2 h-full">
			<h3 className="mb-4 text-lg font-semibold hidden md:block">Documentos</h3>
			<ScrollArea className="h-[calc(100vh-10rem)]">
					{documents.map((doc, index) => (
						<button
							type="button"
							key={doc.id ?? index}
							className="mb-2 flex w-full items-center rounded p-2 text-left transition-colors hover:bg-gray-200"
							onClick={() => onStepChange(index)}
						>
							<div
								className={`mr-2 flex min-h-6 min-w-6 items-center justify-center rounded-full ${
									doc.observation?.length > 0
										? "bg-red-500 text-white"
										: index === currentStep
										? "bg-primary text-primary-foreground"
										: completedSteps?.[index]
										? "bg-green-500 text-white"
										: "bg-gray-300"
								}`}
							>
								{doc.observation?.length > 0 ? (
									<CircleAlert className="h-4 w-4" />
								) : index < currentStep && completedSteps?.[index] ? (
									<Check className="h-4 w-4" />
								) : index === currentStep ? (
									<CircleAlert className="h-4 w-4" />
								) : (
									doc.observation?.length > 0 ? <CircleAlert className="h-4 w-4" color="red" /> : index + 2
								)}
							</div>
							<span className={`${index === currentStep ? "font-semibold" : ""} hidden md:block`}>
								{doc.description}
							</span>
						</button>
					))}
			</ScrollArea>
		</div>
	);
}
