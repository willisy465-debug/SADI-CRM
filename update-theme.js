const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { search: /bg-zinc-950/g, replace: 'bg-slate-50' },
  { search: /bg-zinc-900/g, replace: 'bg-white' },
  { search: /bg-zinc-800/g, replace: 'bg-slate-100' },
  { search: /bg-zinc-800\/50/g, replace: 'bg-slate-100/50' },
  
  // Borders
  { search: /border-zinc-800/g, replace: 'border-slate-200' },
  { search: /border-zinc-700/g, replace: 'border-slate-300' },
  { search: /border-emerald-500/g, replace: 'border-brand-cyan' },
  { search: /border-emerald-500\/50/g, replace: 'border-brand-cyan/50' },

  // Text colors
  { search: /text-zinc-500/g, replace: 'text-slate-500' },
  { search: /text-zinc-400/g, replace: 'text-slate-600' },
  { search: /text-zinc-300/g, replace: 'text-slate-700' },
  { search: /text-white/g, replace: 'text-slate-900' }, // This might affect some buttons where text should stay white
  
  // Brand Accents (Emerald to SADI Blue/Cyan)
  { search: /bg-emerald-600/g, replace: 'bg-brand-navy' },
  { search: /hover:bg-emerald-700/g, replace: 'hover:opacity-90' },
  { search: /hover:bg-emerald-500/g, replace: 'hover:bg-brand-cyan' },
  { search: /bg-emerald-500/g, replace: 'bg-brand-cyan' },
  { search: /text-emerald-500/g, replace: 'text-brand-cyan' },
  { search: /text-emerald-400/g, replace: 'text-brand-cyan' },
  { search: /text-emerald-600/g, replace: 'text-brand-navy' },
  { search: /hover:text-emerald-500/g, replace: 'hover:text-brand-cyan' },
  { search: /hover:text-emerald-400/g, replace: 'hover:text-brand-cyan' },
  { search: /focus-visible:ring-emerald-500/g, replace: 'focus-visible:ring-brand-cyan' },
  { search: /ring-emerald-500/g, replace: 'ring-brand-cyan' },
  { search: /shadow-emerald-900\/50/g, replace: 'shadow-brand-navy/20' },
  { search: /shadow-emerald-900\/20/g, replace: 'shadow-brand-navy/10' },
  { search: /bg-emerald-600\/20/g, replace: 'bg-brand-cyan/20' },
  { search: /from-emerald-500/g, replace: 'from-brand-cyan' },
  { search: /to-emerald-700/g, replace: 'to-brand-navy' },

  // Special cases: White text inside buttons/badges that shouldn't turn to dark slate
  // Since we replaced all text-white with text-slate-900, we need to fix it for brand backgrounds
  { search: /text-slate-900 shadow-lg shadow-brand-navy/g, replace: 'text-white shadow-lg shadow-brand-navy' },
  { search: /bg-brand-navy hover:opacity-90 text-slate-900/g, replace: 'bg-brand-navy hover:opacity-90 text-white' },
  { search: /bg-brand-navy hover:bg-brand-cyan text-slate-900/g, replace: 'bg-brand-navy hover:bg-brand-cyan text-white' },
  { search: /bg-brand-navy text-slate-900/g, replace: 'bg-brand-navy text-white' },
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(({ search, replace }) => {
        content = content.replace(search, replace);
      });
      
      // Fix generic "text-slate-900" inside elements that specifically need text-white
      content = content.replace(/className="([^"]*)bg-brand-navy([^"]*)text-slate-900([^"]*)"/g, 'className="$1bg-brand-navy$2text-white$3"');
      content = content.replace(/className="([^"]*)bg-red-500([^"]*)text-slate-900([^"]*)"/g, 'className="$1bg-red-500$2text-white$3"');
      content = content.replace(/className="([^"]*)bg-red-600([^"]*)text-slate-900([^"]*)"/g, 'className="$1bg-red-600$2text-white$3"');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(path.join(__dirname, 'src/app'));
processDirectory(path.join(__dirname, 'src/components'));

console.log("Theme update complete!");
