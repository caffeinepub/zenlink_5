/**
 * Version 11 Export Script
 * Generates a clean snapshot of the project for sharing
 * Preserves relative paths and excludes build artifacts
 */

import * as fs from 'fs';
import * as path from 'path';
import { exportConfig } from './export-version11-config';

interface CopyStats {
  filesCopied: number;
  directoriesCreated: number;
  bytesTotal: number;
}

const stats: CopyStats = {
  filesCopied: 0,
  directoriesCreated: 0,
  bytesTotal: 0,
};

/**
 * Check if a path should be excluded based on patterns
 */
function shouldExclude(relativePath: string): boolean {
  const pathParts = relativePath.split(path.sep);
  
  return exportConfig.excludePatterns.some(pattern => {
    // Check if any part of the path matches the pattern
    if (pattern.startsWith('*')) {
      const ext = pattern.slice(1);
      return relativePath.endsWith(ext);
    }
    return pathParts.some(part => part === pattern || part.startsWith(pattern));
  });
}

/**
 * Recursively copy directory contents
 */
function copyDirectory(source: string, destination: string, rootPath: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
    stats.directoriesCreated++;
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    const relativePath = path.relative(rootPath, sourcePath);

    if (shouldExclude(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destPath, rootPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      const fileStats = fs.statSync(sourcePath);
      stats.filesCopied++;
      stats.bytesTotal += fileStats.size;
    }
  }
}

/**
 * Generate README content
 */
function generateReadme(): string {
  return `# ZenLink Version 11 - Export Package

This folder contains a complete snapshot of ZenLink Version 11 source code.

## 📦 Contents

This export includes:
- Complete backend code (Motoko)
- Complete frontend code (React + TypeScript)
- Configuration files
- Project state

**Excluded** (for clean sharing):
- node_modules
- Build artifacts (dist, .dfx, target)
- Git history
- Cache files
- Log files

## 📤 How to Share This Code

### Option 1: Share as ZIP (Recommended)

#### On Windows:
1. Right-click the \`version11\` folder
2. Select "Send to" → "Compressed (zipped) folder"
3. Share the generated ZIP file

#### On macOS:
1. Right-click the \`version11\` folder
2. Select "Compress version11"
3. Share the generated ZIP file

#### On Linux:
\`\`\`bash
zip -r version11.zip version11/
\`\`\`

### Option 2: Share via WhatsApp (Text)

If you need to share code snippets via WhatsApp text:

1. **For small code blocks**, wrap in backticks:
   \\\`your code here\\\`

2. **For full files**, use triple backticks:
   \\\`\\\`\\\`
   [paste entire file content here]
   \\\`\\\`\\\`

This preserves formatting and prevents WhatsApp from changing your code.

### Option 3: Share as Document

1. Compress the folder as ZIP (see Option 1)
2. In WhatsApp, tap the attachment icon (📎)
3. Select "Document"
4. Choose your ZIP file
5. Send

This is the **safest method** - the code stays exactly as-is.

## 🔄 Regenerating This Export

To refresh this snapshot with the latest code:

\`\`\`bash
cd frontend/scripts
npx tsx export-version11.ts
\`\`\`

Or if you have ts-node installed:

\`\`\`bash
cd frontend/scripts
ts-node export-version11.ts
\`\`\`

## 📋 What's Excluded

The following are intentionally excluded to keep the export clean and shareable:

${exportConfig.excludePatterns.map(p => `- ${p}`).join('\n')}

## 💡 Tips

- Always share as ZIP when possible - it's the most reliable method
- If sharing code text, always use code blocks (backticks) to preserve formatting
- This export is a snapshot - regenerate it to capture new changes
- The original project remains unchanged; this is just a copy

---

**Built with ❤️ using [caffeine.ai](https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'zenlink-app')})**
`;
}

/**
 * Main export function
 */
function exportVersion11(): void {
  console.log('🚀 Starting Version 11 export...\n');

  const projectRoot = path.resolve(__dirname, '../..');
  const outputPath = path.resolve(projectRoot, exportConfig.outputDir);

  // Clean output directory if it exists
  if (fs.existsSync(outputPath)) {
    console.log('🧹 Cleaning existing export directory...');
    fs.rmSync(outputPath, { recursive: true, force: true });
  }

  // Create output directory
  fs.mkdirSync(outputPath, { recursive: true });
  console.log(`📁 Created export directory: ${exportConfig.outputDir}\n`);

  // Copy each include root
  for (const includeRoot of exportConfig.includeRoots) {
    const sourcePath = path.resolve(projectRoot, includeRoot);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Skipping ${includeRoot} (not found)`);
      continue;
    }

    const destPath = path.join(outputPath, includeRoot);
    
    console.log(`📋 Copying ${includeRoot}...`);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath, projectRoot);
    } else {
      // Single file
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, destPath);
      stats.filesCopied++;
      stats.bytesTotal += fs.statSync(sourcePath).size;
    }
  }

  // Generate and write README
  console.log('\n📝 Generating README...');
  const readmePath = path.join(outputPath, 'README.md');
  fs.writeFileSync(readmePath, generateReadme(), 'utf-8');
  stats.filesCopied++;

  // Generate .exportignore file
  console.log('📝 Generating .exportignore...');
  const exportIgnorePath = path.join(outputPath, '.exportignore');
  const exportIgnoreContent = [
    '# Export Ignore File',
    '# These patterns are excluded from the Version 11 export',
    '',
    ...exportConfig.excludePatterns.map(p => p),
    '',
    '# This file is for documentation only',
  ].join('\n');
  fs.writeFileSync(exportIgnorePath, exportIgnoreContent, 'utf-8');
  stats.filesCopied++;

  // Print summary
  console.log('\n✅ Export complete!\n');
  console.log('📊 Summary:');
  console.log(`   Files copied: ${stats.filesCopied}`);
  console.log(`   Directories created: ${stats.directoriesCreated}`);
  console.log(`   Total size: ${(stats.bytesTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\n📦 Export location: ${exportConfig.outputDir}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Navigate to the export folder');
  console.log('   2. Read the README.md for sharing instructions');
  console.log('   3. Compress as ZIP for easy sharing\n');
}

// Run the export
try {
  exportVersion11();
} catch (error) {
  console.error('❌ Export failed:', error);
  process.exit(1);
}
