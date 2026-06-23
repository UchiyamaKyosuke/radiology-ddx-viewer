# iPhone viewer

このリポジトリは、iPhone で `.rddx` パックを読み込んで検索するための静的Webビューアです。

推奨する使い方:

1. このリポジトリを GitHub Pages で公開します。
2. PCアプリで `radiology-ddx-pack.rddx` を作成します。
3. `.rddx` ファイルを OneDrive にコピーします。
4. iPhone でビューアURLを開きます。
5. `.rddx を選択` をタップします。
6. iOSのファイルアプリ、またはOneDriveプロバイダから `.rddx` を選択します。

疾患データはこのWebページ自体には含めません。読み込み後の `.rddx` の内容は、iPhoneのブラウザ内ストレージに保存されます。

OneDrive共有URLからの直接読み込みは、認証やCORS制限で失敗しやすいため、標準運用にはしていません。
