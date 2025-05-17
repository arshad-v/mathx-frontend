import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

const PROMPT_SUGGESTIONS = [
  "Create a visualization of a sine wave transforming into a cosine wave",
  "Show a 3D sphere morphing into a torus",
  "Animate the Pythagorean theorem with squares on the sides of a right triangle",
  "Visualize a Fourier series approximation of a square wave",
  "Show a binary search algorithm on a sorted array"
];

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
          Describe the mathematical animation you want to create
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            rows={5}
            className="input font-medium"
            placeholder="e.g., Show a visualization of the calculus chain rule with animations..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
          <button
            type="submit"
            className={`absolute right-2 bottom-2 p-2 rounded-md ${
              prompt.trim() && !isGenerating
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!prompt.trim() || isGenerating}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Try one of these examples:</p>
        <div className="flex flex-wrap gap-2">
          {PROMPT_SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs bg-dark-100 hover:bg-dark-300 text-gray-400 px-3 py-1.5 rounded-full transition-colors"
              disabled={isGenerating}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptForm;