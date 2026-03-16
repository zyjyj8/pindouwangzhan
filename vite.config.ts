import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pindouwangzhan/', // 关键配置，和仓库名一致
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
