export const imageService = {
  validateExtension(filename) {
    // TODO: implement extension whitelist
  },

  validateSize(file, maxMB = 5) {
    // TODO: implement size validation
  },

  compress(file, quality = 0.8) {
    // TODO: implement client-side compression
  },

  generateFileName(originalName) {
    // TODO: implement unique filename generation
  },

  getDimensions(file) {
    // TODO: implement image dimension reader
  },

  isImage(file) {
    // TODO: implement mime type check
  },

  toWebP(file, quality = 0.8) {
    // TODO: implement WebP conversion
  },

  createThumbnail(file, size = 300) {
    // TODO: implement thumbnail generation
  }
}
