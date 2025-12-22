import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dynamic API target based on branch (no env variable needed - auto-detect)
// Automatically detects branch from GitLab CI environment
// const getApiTarget = () => {
//   // Get branch name - GitLab CI automatically provides CI_COMMIT_REF_NAME
//   const branch = process.env.CI_COMMIT_REF_NAME || process.env.GIT_BRANCH || '';
  
//   console.log(`🌿 Detected branch: ${branch || 'unknown (defaulting to staging)'}`);
  
//   // Main/master branch → Production API
//   if (branch === 'main' || branch === 'master') {
//     console.log('✅ Using PRODUCTION API: https://api.crickbro.com/');
//     return 'https://api.crickbro.com/';
//   }
  
//   // Staging branch → Staging API
//   if (branch === 'staging' || branch.includes('staging')) {
//     console.log('✅ Using STAGING API: https://stagingapi.crickbro.com:4001/');
//     return 'https://stagingapi.crickbro.com:4001/';
//   }
  
//   // Default to staging for other branches/development
//   console.log('⚠️ Using STAGING API (default): https://stagingapi.crickbro.com:4001/');
//   return 'https://stagingapi.crickbro.com:4001/';
// };
// const apiTarget = getApiTarget();

const apiTarget = 'https://stagingapi.crickbro.com:4001/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    proxy: {
      '/webSiteApi': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1500, // KB, increase from default 500
  },
 
});

