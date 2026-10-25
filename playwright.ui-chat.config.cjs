const config = require('./playwright.chat.config.cjs');
module.exports = {
  ...config,
  outputDir: 'test-results/chat-viewports',
  projects: [320, 375, 390, 430, 768, 1024, 1440].map((width) => ({
    name: 'width-' + width,
    use: {
      viewport: { width, height: 844 },
      isMobile: width < 1024,
      hasTouch: width < 1024,
    },
  })),
};
