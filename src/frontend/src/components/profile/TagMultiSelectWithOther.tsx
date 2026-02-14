import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { X, Plus } from 'lucide-react';
import { containsNormalized } from '../../utils/strings';

interface TagMultiSelectWithOtherProps {
  label: string;
  predefinedOptions: readonly string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
}

export default function TagMultiSelectWithOther({
  label,
  predefinedOptions,
  selectedValues,
  onSelectionChange,
  placeholder = 'Type your own...',
}: TagMultiSelectWithOtherProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleToggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onSelectionChange(selectedValues.filter(v => v !== option));
    } else {
      onSelectionChange([...selectedValues, option]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customValue.trim();
    if (!trimmed) return;

    // Check for duplicates (case/trim-insensitive)
    if (containsNormalized(selectedValues, trimmed)) {
      // Already exists, just clear input
      setCustomValue('');
      return;
    }

    // Add custom value
    onSelectionChange([...selectedValues, trimmed]);
    setCustomValue('');
    setShowCustomInput(false);
  };

  const handleRemoveValue = (value: string) => {
    onSelectionChange(selectedValues.filter(v => v !== value));
  };

  const isSelected = (option: string) => selectedValues.includes(option);

  return (
    <div className="space-y-3">
      <Label className="text-base">{label}</Label>
      
      {/* Predefined options grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {predefinedOptions.map((option) => (
          <Button
            key={option}
            type="button"
            variant={isSelected(option) ? 'default' : 'outline'}
            className={`justify-start text-sm h-auto py-2 px-3 ${
              isSelected(option) 
                ? 'bg-zen-lavender/20 border-zen-lavender text-zen-lavender hover:bg-zen-lavender/30' 
                : 'glass-card hover:border-zen-lavender/50'
            }`}
            onClick={() => handleToggleOption(option)}
          >
            {option}
          </Button>
        ))}
        
        {/* Other button */}
        <Button
          type="button"
          variant={showCustomInput ? 'default' : 'outline'}
          className={`justify-start text-sm h-auto py-2 px-3 ${
            showCustomInput 
              ? 'bg-zen-blush/20 border-zen-blush text-zen-blush hover:bg-zen-blush/30' 
              : 'glass-card hover:border-zen-blush/50'
          }`}
          onClick={() => setShowCustomInput(!showCustomInput)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Other
        </Button>
      </div>

      {/* Custom input (shown when "Other" is active) */}
      {showCustomInput && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder={placeholder}
            className="glass-card"
          />
          <Button 
            type="button" 
            onClick={handleAddCustom}
            className="btn-secondary shrink-0"
          >
            Add
          </Button>
        </div>
      )}

      {/* Selected values display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 glass-card rounded-2xl">
          {selectedValues.map((value) => (
            <Badge 
              key={value} 
              variant="secondary" 
              className="glass-card text-sm py-1 px-3"
            >
              {value}
              <button
                type="button"
                onClick={() => handleRemoveValue(value)}
                className="ml-2 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
