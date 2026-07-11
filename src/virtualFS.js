/**
 * Virtual File System for the terminal.
 * Tree structure with nodes of type 'dir' (folder) or 'file'.
 *
 * Each folder node has:
 *   - type: 'dir'
 *   - children: object with key = child name
 *
 * Each file node has:
 *   - type: 'file'
 *   - content: string with the text content
 */

export const virtualFS = {
  type: 'dir',
  children: {
    'whoAmI.md': {
      type: 'file',
      content: `# About Me — Harjeet Singh

Hey there! I'm **Harjeet Singh**, a 16-year-old
passionate programmer based in Italy.

Currently attending a High School of Applied
Sciences (Liceo Scientifico Opzione Scienze
Applicate), I am mostly self-taught, having
built my entire tech stack through pure
dedication at home over the past 2 years.

## 🏆 Achievements
- **Competitive Programming:** National finalist
  at OII (Italian Olympiads in Informatics).
- **Cybersecurity:** National finalist at
  OliCyber (Italian Cybersecurity Olympiads
  for high school students).

## 🛠️ Tech Stack
- **Languages:** C, C++, Python, HTML/CSS,
  JavaScript
- **Automation & Backend:** n8n, Supabase
- **Current Focus:** Actively deep-diving into
  AI Agentic Frameworks and studying
  Machine Learning.`
    },
    'projects': {
      type: 'dir',
      children: {
        'cena.md': {
          type: 'file',
          content: `# cena — Edge‑Native Visual Copilot

**cena** couples **YOLO‑World** object detection,
**MediaPipe Hands** hand‑tracking, and the
lightweight VLM **Moondream‑2** to provide
real‑time scene understanding on edge devices.

It writes the world state into plain markdown
files instead of a vector database, enabling
zero‑latency context retrieval for downstream
AI agents like OpenClaw.

Built by a 16‑year‑old developer, optimized
for Apple Silicon (M4).

🔗 GitHub: https://github.com/harciufff/cena`
        },
        'aey.md': {
          type: 'file',
          content: `# aey — Neuro-Symbolic GraphRAG Assistant

**aey** is a modular Python framework merging
**Neural** (Google Gemini) and **Symbolic**
(Neo4j graph) AI into a structure-centric
GraphRAG knowledge base.

Instead of dumping raw text into vector stores,
it stores knowledge as typed semantic edges
(EXTENDS, CONTRADICTS, SUPPORTS) inside a
deterministic graph — eliminating hallucinations
with hard logical constraints.

Stack: LangChain, Neo4j, Crawl4AI, Gemini API.

🔗 GitHub: https://github.com/harciufff/aey`
        }
      }
    },
    'contact.md': {
      type: 'file',
      content: `# Contact & Links

📧 **Email:** hrjtdev@gmail.com

💼 **LinkedIn:** [harjeetsinghdev](https://www.linkedin.com/in/harjeetsinghdev)

🔗 **GitHub:** [harciufff](https://github.com/harciufff)

𝕏 **X:** [harciufff](https://x.com/harciufff)`
    }
  }
};

/**
 * Converts a path array into a readable string.
 * E.g. [] => '~', ['projects'] => '~/projects'
 *
 * @param {string[]} pathArray - Array of path segments
 * @returns {string} Formatted path string
 */
export function pathToString(pathArray) {
  return pathArray.length > 0 ? `~/${pathArray.join('/')}` : '~';
}

/**
 * Given the root of the virtual file system and a path array
 * (e.g. ['projects'] or [] for root),
 * returns the node corresponding to the directory.
 *
 * If the path doesn't exist or isn't a folder, returns null.
 *
 * @param {Object} fs  - The virtual file system (root node)
 * @param {string[]} pathArray - Array of path segments
 * @returns {Object|null} The directory node or null
 */
export function getDirectoryByPath(fs, pathArray) {
  let current = fs;

  for (const segment of pathArray) {
    if (current.type !== 'dir' || !current.children || !current.children[segment]) {
      return null;
    }
    current = current.children[segment];
    if (current.type !== 'dir') {
      // We reached a file instead of a folder
      return null;
    }
  }

  return current;
}

/**
 * Given the root of the virtual file system and a path array,
 * returns the content of a file (string) or null
 * if the file doesn't exist or the path is a folder.
 *
 * @param {Object} fs - The virtual file system (root node)
 * @param {string[]} pathArray - Array of path segments
 * @param {string} fileName - Name of the file to read
 * @returns {string|null} File content or null
 */
export function getFileContent(fs, pathArray, fileName) {
  const dir = getDirectoryByPath(fs, pathArray);
  if (!dir) return null;

  const entry = dir.children[fileName];
  if (!entry || entry.type !== 'file') return null;

  return entry.content;
}
