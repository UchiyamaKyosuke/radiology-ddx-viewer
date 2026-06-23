# iPhone viewer

This repository hosts a static web viewer for the mobile `.rddx` pack.

Recommended use:

1. Publish this repository with GitHub Pages.
2. Create `radiology-ddx-pack.rddx` from the PC admin app.
3. Copy the `.rddx` file to OneDrive.
4. Open the viewer URL on iPhone.
5. Tap `.rddx を選択`.
6. Choose the `.rddx` file from the iOS Files app or OneDrive provider.

The disease data is not bundled in this web page. After import, the `.rddx` contents are saved only in the iPhone browser storage.

Direct loading from a OneDrive share URL is intentionally not the main path because browser access to OneDrive shared files can fail due to authentication and CORS restrictions.
