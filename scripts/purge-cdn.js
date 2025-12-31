const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://purge.jsdelivr.net/gh/Caprog/proto-helpers@main';
const DIRS_TO_PURGE = ['libs'];

async function purgeFile(relativePath) {
    const url = `${BASE_URL}/${relativePath}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        // Check if the overall status is 'finished'
        if (data.status === 'finished') {
            console.log(`[SUCCESS] Purged ${relativePath}`);
        } else {
            console.log(`[FAILED] Purged ${relativePath}: status=${data.status}`);
        }
    } catch (error) {
        console.error(`[ERROR] Failed to purge ${relativePath}:`, error.message);
    }
}

async function main() {
    const rootDir = path.resolve(__dirname, '..');

    for (const dir of DIRS_TO_PURGE) {
        const dirPath = path.join(rootDir, dir);
        
        if (!fs.existsSync(dirPath)) {
            console.warn(`Directory not found: ${dir}`);
            continue;
        }

        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            // Skip hidden files or non-files if necessary, simple check for now
            if (file.startsWith('.')) continue;
            
            // Construct relative path like 'libs/gsap-animator.js'
            // We assume DIRS_TO_PURGE entries are direct children of root
            const relativePath = `${dir}/${file}`;
            await purgeFile(relativePath);
        }
    }
}

main();
