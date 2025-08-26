import { useState } from "react";
import { ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { availableModels, type ModelId } from "@shared/schema";

interface LLMSelectorProps {
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
  disabled?: boolean;
}

const modelColors = {
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
} as const;

export function LLMSelector({ selectedModel, onModelChange, disabled }: LLMSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentModel = availableModels.find(model => model.id === selectedModel);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 transition-colors duration-200 border-slate-300"
          data-testid="model-selector-button"
        >
          <div className={`w-2 h-2 rounded-full animate-pulse ${modelColors[currentModel?.color || 'blue']}`} />
          <span className="font-medium text-slate-700">{currentModel?.name}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48 bg-white shadow-xl border border-slate-200">
        {availableModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => {
              onModelChange(model.id);
              setIsOpen(false);
            }}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
            data-testid={`model-option-${model.id}`}
          >
            <div className={`w-3 h-3 rounded-full ${modelColors[model.color]}`} />
            <div className="flex-1">
              <div className="font-medium text-slate-800">{model.name}</div>
              <div className="text-xs text-slate-500">{model.description}</div>
            </div>
            {model.id === selectedModel && (
              <Zap className="w-4 h-4 text-indigo-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
