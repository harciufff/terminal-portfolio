/**
 * TerminalBlock — Component for a single command/output block
 * in Warp terminal style.
 *
 * Props:
 *   - command:    string of the command typed by the user
 *   - output:     string or React node of the resulting output
 *   - promptText: optional custom text to replace the ❯ prompt
 */

/* eslint-disable react/prop-types */
export default function TerminalBlock({ command, output, promptText }) {
  return (
    <div className="border border-zinc-800 bg-[#0d0d0d] px-3 py-2.5 transition-all duration-200 hover:border-zinc-700 sm:px-4 sm:py-3">
      {/* Command line with prompt */}
      <div className="mb-1.5 flex items-start gap-1.5 text-xs sm:mb-2 sm:gap-2 sm:text-sm">
        {promptText ? (
          <span className="mt-[1px] shrink-0 select-none text-xs text-zinc-500 sm:text-sm">
            {promptText}
          </span>
        ) : (
          <>
            <span className="mt-[1px] shrink-0 select-none text-xs text-fuchsia-400 sm:text-sm">
              ❯
            </span>
            <span className="text-zinc-300">{command}</span>
          </>
        )}
      </div>

      {/* Subtle separator */}
      {output && (
        <div className="my-1.5 border-t border-zinc-800/50 sm:my-2" />
      )}

      {/* Command output */}
      {output && (
        <div className="whitespace-pre-wrap break-words text-xs leading-relaxed text-zinc-400 sm:text-sm">
          {output}
        </div>
      )}
    </div>
  );
}
