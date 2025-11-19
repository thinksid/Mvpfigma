
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'stripe@17.4.0': 'stripe',
        'figma:asset/f44254d0d6e22d9d926524de6c35bc2f7cf74b9b.png': path.resolve(__dirname, './src/assets/f44254d0d6e22d9d926524de6c35bc2f7cf74b9b.png'),
        'figma:asset/d2305a08b87429395ab71a84cfa59ed81967566b.png': path.resolve(__dirname, './src/assets/d2305a08b87429395ab71a84cfa59ed81967566b.png'),
        'figma:asset/cff0762a6794db634da4baa2ef71750dfd161e77.png': path.resolve(__dirname, './src/assets/cff0762a6794db634da4baa2ef71750dfd161e77.png'),
        'figma:asset/606061009c53a75486f86348358a6812983190ed.png': path.resolve(__dirname, './src/assets/606061009c53a75486f86348358a6812983190ed.png'),
        'figma:asset/4a18ae42701be2fc15037d37d296a7ce66a36686.png': path.resolve(__dirname, './src/assets/4a18ae42701be2fc15037d37d296a7ce66a36686.png'),
        'figma:asset/1e13ed9b8f1270426370ad9ff3f88e9cba33ecb8.png': path.resolve(__dirname, './src/assets/1e13ed9b8f1270426370ad9ff3f88e9cba33ecb8.png'),
        'figma:asset/066079ea76dbb1c4070b0fbcf6c6b88ae9766072.png': path.resolve(__dirname, './src/assets/066079ea76dbb1c4070b0fbcf6c6b88ae9766072.png'),
        'figma:asset/00ba47538c52501c3f143a608514979f2c1f6213.png': path.resolve(__dirname, './src/assets/00ba47538c52501c3f143a608514979f2c1f6213.png'),
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@jsr/supabase__supabase-js@2': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });