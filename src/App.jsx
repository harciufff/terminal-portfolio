import { useState, useRef, useEffect } from 'react';
import { virtualFS, getDirectoryByPath, getFileContent, pathToString } from './virtualFS.js';
import TerminalBlock from './components/TerminalBlock.jsx';
import TerminalInput from './components/TerminalInput.jsx';
import renderMarkdown from './renderMarkdown.jsx';

/**
 * App — Main terminal component.
 *
 * Manages:
 *   - currentPath: current path array ([] = root ~)
 *   - history:     array of { command, output } for rendered blocks
 *
 * Supported commands: pwd, whoami, ls, cd, cat, clear, help
 */

const HELP_TEXT = `# Available Commands

- **pwd** — Print current working directory
- **whoami** — Print the current user
- **help** — Show this help message
- **ls** — List files and folders in the
  current directory
- **cd [dir]** — Change directory (use **..**
  to go back, **~** for root)
- **cat [file]** — Print the content of a file
- **clear** — Clear the terminal screen`;

/** Format current date/time like macOS terminal: Sat Jul 11 18:11:01 */
function getLastLogin() {
  const d = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n) => String(n).padStart(2, '0');
  return `Last login: ${days[d.getDay()]} ${months[d.getMonth()]} ${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} on ttys000`;
}

function App() {
  // Current path as array ([] = root ~)
  const [currentPath, setCurrentPath] = useState([]);

  // Command history: array of { id, command, output, promptText? }
  const [history, setHistory] = useState([
    {
      id: 0,
      command: '',
      promptText: getLastLogin(),
      output: renderMarkdown(`# Welcome to my personal website

Hi! I'm **Harjeet Singh** — a 16-year-old
programmer and builder from Italy.

Try typing **'help'** to see the available
commands, or explore with **'ls'**.`),
    },
  ]);

  const historyEndRef = useRef(null);

  // Auto-scroll down when history changes
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Incremental ID for blocks
  const nextId = useRef(history.length);

  /**
   * Process a command entered by the user and return the output.
   */
  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ') || null;

    let output = '';

    switch (cmd) {
      /* ─── ls ─────────────────────────────── */
      case 'ls': {
        const dir = getDirectoryByPath(virtualFS, currentPath);
        if (!dir) {
          output = 'ls: directory not found (internal bug)';
          break;
        }
        const entries = Object.keys(dir.children);

        if (entries.length === 0) {
          output = '(empty directory)';
        } else {
          // Returns a React fragment to distinguish folders in bold (Warp style)
          output = (
            <span>
              {entries.map((name, i) => {
                const isDir = dir.children[name].type === 'dir';
                return (
                  <span key={name}>
                    {i > 0 && '    '}
                    {isDir ? (
                      <span className="font-bold text-zinc-300">{name}/</span>
                    ) : (
                      <span>{name}</span>
                    )}
                  </span>
                );
              })}
            </span>
          );
        }
        break;
      }

      /* ─── cd ─────────────────────────────── */
      case 'cd': {
        // cd empty / cd ~ / cd with no argument → go to root
        if (!arg || arg === '~') {
          setCurrentPath([]);
          output = ''; // No output for successful cd
          break;
        }

        // cd ..
        if (arg === '..') {
          if (currentPath.length === 0) {
            output = ''; // Already at root
          } else {
            setCurrentPath(currentPath.slice(0, -1));
            output = '';
          }
          break;
        }

        // cd foldername
        const targetDir = getDirectoryByPath(virtualFS, currentPath);
        if (!targetDir || !targetDir.children[arg] || targetDir.children[arg].type !== 'dir') {
          output = `cd: ${arg}: no such directory`;
          break;
        }

        setCurrentPath([...currentPath, arg]);
        output = '';
        break;
      }

      /* ─── cat ─────────────────────────────── */
      case 'cat': {
        if (!arg) {
          output = 'cat: usage: cat <filename>';
          break;
        }

        const content = getFileContent(virtualFS, currentPath, arg);
        if (content === null) {
          output = `cat: ${arg}: file not found`;
          break;
        }

        // Render markdown for .md files
        if (arg.endsWith('.md')) {
          output = renderMarkdown(content);
        } else {
          output = content;
        }
        break;
      }

      /* ─── clear ───────────────────────────── */
      case 'clear':
        setHistory([]);
        // clear doesn't produce a visible block
        return; // <-- exit without adding anything to history

      /* ─── pwd ─────────────────────────────── */
      case 'pwd':
        output = pathToString(currentPath);
        break;

      /* ─── whoami ──────────────────────────── */
      case 'whoami':
        output = "Harjeet Singh, what dyu think i was tbh?";
        break;

      /* ─── help ───────────────────────────── */
      case 'help':
        output = renderMarkdown(HELP_TEXT);
        break;

      /* ─── unknown command ────────────────── */
      default:
        output = `bash: ${cmd}: command not found. Type 'help' for the list.`;
        break;
    }

    // Add the block to history
    const id = nextId.current++;
    setHistory((prev) => [
      ...prev,
      {
        id,
        command: rawInput,
        output,
      },
    ]);
  }


  return (
    <div className="min-h-screen bg-black text-zinc-200">
      {/* Main container with padding to avoid overlapping the input bar */}
      <main className="px-3 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-6">
        {/* Command/output block list */}
        {history.map((entry) => (
          <TerminalBlock
            key={entry.id}
            command={entry.command}
            output={entry.output}
            promptText={entry.promptText}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={historyEndRef} />
      </main>

      {/* Fixed bottom input bar */}
      <TerminalInput
        currentPath={currentPath}
        onSubmit={executeCommand}
      />
    </div>
  );
}

export default App;
