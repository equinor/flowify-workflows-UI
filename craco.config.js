const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@form': path.resolve(__dirname, 'src/components/form'),
      '@models/v2': path.resolve(__dirname, 'src/models/v2'),
      '@common': path.resolve(__dirname, 'src/common'),
    },
  },
};
