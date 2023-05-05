if (process.env.NODE_ENV === 'production') {
  // use minified version for production
  module.exports = require('pdfjs-dist/build/pdf.worker.min.js')
} else {
  module.exports = require('pdfjs-dist/build/pdf.worker.js')
}
