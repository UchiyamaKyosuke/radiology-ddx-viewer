# Radiology DDX Starter 日本語版

個人利用を想定した、オフライン優先の画像診断鑑別検索システムです。

全体は3つのフェーズに分かれます。

```text
Phase 1: Codexで疾患カードdraftを生成
Phase 2: PC管理アプリで医師レビュー、辞書編集、iPhone用pack作成
Phase 3: iPhone viewerでZIP packを読み込み、オフライン検索
```

## Phase 1: Codexでdraft生成

Codexが文献情報やsource JSONから疾患カードdraftを作成します。

draft作成後は、辞書候補、辞書メンテナンスレポート、検証、検索index、鑑別グラフを自動更新する運用を想定しています。

主なファイル:

```text
scripts/literature-to-draft.js
scripts/generate-draft.js
scripts/dictionary-maintenance.js
scripts/prompts/disease-card-extraction.md
data/drafts/
data/sources/
data/dictionaries/
data/generated/
```

## Phase 2: PC管理アプリ

PC管理アプリでは、ローカルデータを確認・編集し、iPhone用ファイルを作成します。

主な操作:

1. draft疾患カードを医師レビューし、approved化する
2. 疾患カードをフォームで編集する
3. 不要な疾患カードを `data/trash/cards/` へ退避削除する
4. `finding-concepts.json` をフォームで編集する
5. 必要時だけJSON原文を開いて詳細編集する
6. 辞書候補、鑑別グラフ、検索indexを再生成する
7. ローカルデータのバックアップを作成する
8. 全体点検を実行する
9. iPhone用 ZIP packを作成し、OneDriveフォルダへコピーする

GUI起動:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File apps\pc-admin\pc-admin-gui.ps1
```

または:

```text
apps\pc-admin\Start-PC-Admin-GUI.bat
```

CLI起動:

```powershell
node apps\pc-admin\pc-admin.js
```

よく使うCLI:

```powershell
node apps\pc-admin\pc-admin.js status
node apps\pc-admin\pc-admin.js approve-draft glioblastoma
node apps\pc-admin\pc-admin.js maintenance
node apps\pc-admin\pc-admin.js backup
node apps\pc-admin\pc-admin.js doctor
node apps\pc-admin\pc-admin.js export-mobile "C:\Users\<you>\OneDrive\RadiologyDDX"
```

## Phase 3: iPhone viewer

iPhone viewer自体には疾患データを含めません。

PC管理アプリで作成した `radiology-ddx-pack.zip` をOneDrive経由でiPhoneへ渡し、iPhoneのFiles/OneDriveからviewerに読み込みます。読み込んだデータはIndexedDBに保存され、以後はオフライン検索できます。

主なファイル:

```text
web/
scripts/export-mobile-pack.js
scripts/validate-mobile-pack.js
```

## iPhoneへ送る

```powershell
node apps\pc-admin\pc-admin.js export-mobile "C:\Users\<you>\OneDrive\RadiologyDDX"
```

作成された ZIP packをiPhoneのFiles/OneDriveからviewerへ読み込みます。

## 全体点検

Phase 1-3 の接続をまとめて確認するには、次を実行します。

```powershell
node scripts\doctor.js
```

このコマンドは、疾患カード検証、検索index/鑑別グラフ生成、iPhone用 ZIP pack作成、mobile pack検証、iPhone viewerのJavaScript構文確認、PC管理GUIのスモークテストをまとめて実行します。

## バックアップ

節目ごとにローカルデータをバックアップできます。

```powershell
node scripts\backup-data.js
```

バックアップは `backups/YYYYMMDD-HHMMSS/` に作成されます。疾患カード、辞書、生成index、source、mobile exportメタデータをコピーします。

## 文字化け対策

疾患カード、辞書、生成indexはUTF-8のJSONとして保存します。

PowerShellスクリプトは日本語UIを含むため、BOM付きUTF-8で保存しています。Windows PowerShellではBOMなしUTF-8の日本語スクリプトが文字化けすることがあります。

通常は以下で検証できます。

```powershell
node scripts\validate.js
node scripts\doctor.js
```
