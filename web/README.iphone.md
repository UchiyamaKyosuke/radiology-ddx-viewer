# iPhone viewer

This folder is a static web viewer for the mobile JSON pack.

Recommended use:

1. Publish this `web/` folder as a static site, for example with GitHub Pages.
2. Create `radiology-ddx-pack.json` from the PC admin app.
3. Copy the `.json` file to OneDrive.
4. Open the viewer URL on iPhone.
5. Tap `JSONを選択`.
6. Choose the `.json` file from the iOS Files app or OneDrive provider.

The disease data is not bundled in this web page. After import, the JSON pack contents are saved only in the iPhone browser storage.

Direct loading from a OneDrive share URL is intentionally not the main path because browser access to OneDrive shared files can fail due to authentication and CORS restrictions.
