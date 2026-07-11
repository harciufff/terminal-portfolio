import { useState, useRef, useEffect } from 'react';
import { pathToString } from '../virtualFS.js';

/* eslint-disable react/prop-types */

/**
 * TerminalInput — Fixed bottom input bar with dynamic prompt.
 *
 * Props:
 *   - currentPath:  current path array (e.g. [] = root, ['projects'])
 *   - onSubmit:     callback called when the user presses Enter
 *   - disabled:     if true, input is disabled
 */

export default function TerminalInput({ currentPath, onSubmit, disabled = false }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // Build the prompt string based on the current path
  const promptPath = pathToString(currentPath);

  // Auto-focus on input on mount and after each submit
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Re-focus when clicking on an empty area of the page
  useEffect(() => {
    function handleClick(e) {
      // Avoid stealing focus if the user is selecting text
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!disabled && inputRef.current) {
        inputRef.current.focus();
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [disabled]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputValue.trim() !== '' && !disabled) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-black">
      <div className="px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Prompt — responsive: full on desktop, compact on mobile */}
          <span className="shrink-0 select-none text-xs font-bold sm:text-sm">
            <span className="text-[#7dd3fc]">user@linux</span>
            <span className="text-[#e879f9]"> {promptPath}</span>
            <span className="hidden sm:inline text-[#a3e635]"> git:(</span><span className="hidden sm:inline text-[#facc15]">master</span><span className="hidden sm:inline text-[#a3e635]">)</span>
            <span className="text-[#7dd3fc]"> $</span>
          </span>

          {/* Hidden styled input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            spellCheck={false}
            autoComplete="off"
            autoFocus
            className="min-w-0 flex-1 border-none bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600 sm:text-sm"
            placeholder="type a command..."
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
