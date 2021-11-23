/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on('before:browser:launch', (launchOptions, browser = {}) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--auto-open-devtools-for-tabs');
      return launchOptions;
    }
  });
};
