import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const classMap = {
    'bg-primary-100': 'bg-amber-100',
    'bg-primary-50': 'bg-amber-50',
    'bg-primary-dark': 'bg-amber-600',
    'bg-primary': 'bg-amber-500',
    'text-primary-dark': 'text-amber-600',
    'text-primary': 'text-amber-500',
    'border-primary': 'border-amber-500',
    'from-primary': 'from-amber-500',
    'to-primary-dark': 'to-amber-600',
    'to-primary': 'to-amber-500',
    'ring-primary': 'ring-amber-500',
    'accent-primary': 'accent-amber-500',
    'fill-primary': 'fill-amber-500',

    'bg-dark-400': 'bg-neutral-600',
    'bg-dark-300': 'bg-neutral-700',
    'bg-dark-200': 'bg-neutral-700',
    'bg-dark-100': 'bg-neutral-800',
    'bg-dark': 'bg-neutral-900',
    'text-dark-400': 'text-neutral-600',
    'text-dark-300': 'text-neutral-700',
    'text-dark-200': 'text-neutral-700',
    'text-dark-100': 'text-neutral-800',
    'text-dark': 'text-neutral-900',
    'border-dark-300': 'border-neutral-700',
    'border-dark': 'border-neutral-900',
    'from-dark': 'from-neutral-900',
    'to-dark': 'to-neutral-900',
    'via-dark-200': 'via-neutral-800',
    'via-dark': 'via-neutral-900',

    'bg-light-300': 'bg-neutral-300',
    'bg-light-200': 'bg-neutral-200',
    'bg-light-100': 'bg-neutral-100',
    'bg-light': 'bg-neutral-50',
    'text-light-300': 'text-neutral-400',
    'text-light-200': 'text-neutral-300',
    'text-light-100': 'text-neutral-100',
    'text-light': 'text-neutral-50',
    'border-light-200': 'border-neutral-200',
    'border-light-100': 'border-neutral-100',
    'from-light-100': 'from-neutral-100',
    'via-light-200': 'via-neutral-200',
    'to-light-100': 'to-neutral-100',

    'bg-success': 'bg-emerald-500',
    'text-success': 'text-emerald-500',
    'bg-danger': 'bg-red-500',
    'text-danger': 'text-red-500',

    'font-display': 'font-sans',

    'btn-primary': 'bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    'btn-secondary': 'bg-neutral-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-neutral-800 transition-all duration-300 active:scale-95 border border-neutral-700',
    'btn-outline': 'bg-transparent text-neutral-900 font-semibold px-6 py-3 rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95',

    'card-dark': 'bg-neutral-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl',
    'card': 'bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl',

    'input-field': 'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400',
    'page-container': 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    'section-title': 'text-3xl md:text-4xl font-bold text-neutral-900',

    'badge-primary': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700',
    'badge-success': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700',
    'badge-danger': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700',
    'badge': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',

    'shadow-card-hover': 'shadow-xl',
    'shadow-card': 'shadow-md',
    'shadow-glow': 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',

    'hover-lift': 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300',
    'animate-fade-in': '',
    'animate-slide-up': '',
    'animate-slide-down': '',

    'skeleton': 'animate-pulse bg-neutral-200',
    'glass-dark': 'bg-neutral-900/80 backdrop-blur-md border border-white/10',
    'glass': 'bg-white/10 backdrop-blur-md border border-white/20',
};

const getAllFiles = (dir, ext, fileList = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, ext, fileList);
        } else if (filePath.endsWith(ext)) {
            fileList.push(filePath);
        }
    }
    return fileList;
};

const srcDir = path.join(__dirname, 'src');
const jsxFiles = getAllFiles(srcDir, '.jsx');

let filesModified = 0;

for (const file of jsxFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    // Replace classes based on the map.
    // Use word boundaries or regex to avoid partial matches (e.g., bg-primary-100 being caught by bg-primary)
    // We sort the keys by length descending to replace larger matches first
    const sortedKeys = Object.keys(classMap).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        const value = classMap[key];
        // Match exact class name inside className strings.
        // Needs a regex that matches the class surrounded by spaces, quotes, or backticks
        const regex = new RegExp(`(?<=['"\\\`\\s])${key}(?=['"\\\`\\s])`, 'g');
        newContent = newContent.replace(regex, value);
    }

    // Also remove the explicit "!..." overrides from tailwind classes if we just replaced them
    newContent = newContent.replace(/!px-10/g, 'px-10');
    newContent = newContent.replace(/!py-4/g, 'py-4');
    newContent = newContent.replace(/!py-3\.5/g, 'py-3.5');
    newContent = newContent.replace(/!rounded-2xl/g, 'rounded-2xl');
    newContent = newContent.replace(/!rounded-xl/g, 'rounded-xl');
    newContent = newContent.replace(/!px-4/g, 'px-4');
    newContent = newContent.replace(/!py-2/g, 'py-2');
    newContent = newContent.replace(/!pl-10/g, 'pl-10');
    newContent = newContent.replace(/!pr-10/g, 'pr-10');
    newContent = newContent.replace(/!border-white/g, 'border-white');
    newContent = newContent.replace(/!text-white/g, 'text-white');
    newContent = newContent.replace(/!bg-white/g, 'bg-white');
    newContent = newContent.replace(/!text-dark/g, 'text-neutral-900');
    newContent = newContent.replace(/!px-8/g, 'px-8');
    newContent = newContent.replace(/!px-5/g, 'px-5');

    // Remove empty classNames or double spaces
    newContent = newContent.replace(/className="\s+"/g, 'className=""');
    newContent = newContent.replace(/\s{2,}/g, ' ');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        filesModified++;
    }
}

console.log(`Replaced classes in ${filesModified} files.`);
