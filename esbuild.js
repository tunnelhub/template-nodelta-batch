const glob = require('glob');
const zip = require('@tybys/cross-zip');
const path = require('path');
const esbuildCopy = require('esbuild-plugin-copy');

require('esbuild').build({
  entryPoints: glob.sync('./src/**/*.ts'),
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node14',
  sourcemap: true,
  outdir: './build',
  plugins: [
    esbuildCopy.copy({
      assets: {
        from: ['./tunnelhub.yml'],
        to: ['./build'],
      },
    }),
  ],
}).then(result => {
  if (result.errors.length === 0) {
    const inPath = path.join(__dirname, 'build/');
    const outPath = path.join(__dirname, 'dist', 'artifact.zip');
    zip.zipSync(inPath, outPath, false);
  }
}).catch(() => process.exit(1));