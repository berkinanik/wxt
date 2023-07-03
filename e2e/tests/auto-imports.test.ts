import { describe, it, expect } from 'vitest';
import { TestProject } from '../utils';

describe('Auto Imports', () => {
  it('should output types for entrypoint paths', async () => {
    const project = new TestProject();
    project.addFile(
      'entrypoints/background.ts',
      'export default defineBackgroundScript(() => {})',
    );
    project.addFile(
      'entrypoints/overlay.content.ts',
      'export default defineContentScript(() => {})',
    );
    project.addFile('entrypoints/popup.html', '<html></html>');

    await project.build();

    expect(await project.serializeFile('.wxt/types/paths.d.ts'))
      .toMatchInlineSnapshot(`
        ".wxt/types/paths.d.ts
        ----------------------------------------
        // Generated by wxt
        type EntrypointPath =
          | \\"/background.js\\"
          | \\"/content-scripts/overlay.js\\"
          | \\"/popup.html\\"
        "
      `);
  });

  it('should make some client utils auto-importable', async () => {
    const project = new TestProject();
    project.addFile('entrypoints/popup.html', `<html></html>`);

    await project.build();

    expect(await project.serializeFile('.wxt/types/imports.d.ts'))
      .toMatchInlineSnapshot(`
      ".wxt/types/imports.d.ts
      ----------------------------------------
      // Generated by wxt
      export {}
      declare global {
        const browser: typeof import('webextension-polyfill')
        const defineBackgroundScript: typeof import('wxt/client')['defineBackgroundScript']
        const defineConfig: typeof import('wxt')['defineConfig']
        const defineContentScript: typeof import('wxt/client')['defineContentScript']
        const mountContentScriptUi: typeof import('wxt/client')['mountContentScriptUi']
      }
      "
    `);
  });
});