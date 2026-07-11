/**
 * Simple markdown renderer for terminal output.
 * Supports: # headings, **bold**, [links](url), bare URLs, line breaks.
 */

/* eslint-disable react/no-array-index-key */

/**
 * Parse inline markdown (bold, links) within a single line.
 * @param {string} text - A single line of text
 * @returns {React.ReactNode[]} Array of React nodes
 */
function parseInline(text) {
  // Pattern matches: [text](url), **bold**, or bare URLs
  const pattern = /(\[(.+?)\]\((https?:\/\/[^\s)]+)\))|(\*\*(.+?)\*\*)|(https?:\/\/[^\s)]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // [text](url) markdown link
      parts.push(
        <a
          key={`ml-${match.index}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7dd3fc] underline hover:text-[#e879f9] transition-colors"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      // **bold**
      parts.push(
        <span key={`b-${match.index}`} className="font-bold text-zinc-100">
          {match[5]}
        </span>
      );
    } else if (match[6]) {
      // Bare URL
      parts.push(
        <a
          key={`a-${match.index}`}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7dd3fc] underline hover:text-[#e879f9] transition-colors"
        >
          {match[6]}
        </a>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Render markdown content as React elements.
 * @param {string} content - Markdown string
 * @returns {React.ReactNode} React elements
 */
export default function renderMarkdown(content) {
  const lines = content.split('\n');

  return (
    <div className="leading-relaxed">
      {lines.map((line, i) => {
        // Empty line → <br />
        if (line.trim() === '') {
          return <br key={i} />;
        }

        // Heading (# Title)
        if (/^#{1,2}\s/.test(line)) {
          const text = line.replace(/^#{1,2}\s+/, '');
          return (
            <div key={i} className="mb-1 mt-2 font-bold text-zinc-100">
              {parseInline(text)}
            </div>
          );
        }

        // Regular line with inline parsing
        return (
          <div key={i} className="text-zinc-300">
            {parseInline(line)}
          </div>
        );
      })}
    </div>
  );
}
