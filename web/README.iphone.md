# iPhone viewer

This folder is a static web viewer for the mobile pack.

Recommended use:

1. Publish this `web/` folder as a static site, for example with GitHub Pages.
2. Create `radiology-ddx-pack.rddx` and `radiology-ddx-pack.json` from the PC admin app.
3. Copy the `.rddx` file to OneDrive. If iOS greys it out, copy/use the `.json` fallback instead.
4. Open the viewer URL on iPhone.
5. Tap `packを選択`.
6. Choose the `.rddx` file from the iOS Files app or OneDrive provider. If it is greyed out, choose `radiology-ddx-pack.json`.

The disease data is not bundled in this web page. After import, the pack contents are saved only in the iPhone browser storage.

Direct loading from a OneDrive share URL is intentionally not the main path because browser access to OneDrive shared files can fail due to authentication and CORS restrictions.
