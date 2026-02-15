/**
 * Configuration for Version 11 export script
 * Defines which files/folders to include and exclude from the export snapshot
 */

export interface ExportConfig {
  /** Root directories to include in export */
  includeRoots: string[];
  /** Patterns to exclude (build artifacts, dependencies, etc.) */
  excludePatterns: string[];
  /** Output directory for the export */
  outputDir: string;
}

export const exportConfig: ExportConfig = {
  includeRoots: [
    'backend',
    'frontend',
    'project_state.json',
  ],
  excludePatterns: [
    'node_modules',
    'dist',
    '.dfx',
    '.mops',
    '.git',
    '.gitignore',
    'target',
    'build',
    '.cache',
    '.turbo',
    '.next',
    '.vercel',
    'coverage',
    '.nyc_output',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
  ],
  outputDir: 'frontend/share/version11',
};
