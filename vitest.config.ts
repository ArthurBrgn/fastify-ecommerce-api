import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        fileParallelism: false,
        globals: true,
        environment: 'node',
        alias: {
            '@/': new URL('./src/', import.meta.url).pathname, 
        }
    }
})
