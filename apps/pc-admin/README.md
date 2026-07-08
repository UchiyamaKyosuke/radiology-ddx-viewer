# Phase 2 PC管理アプリ

Phase 2 で使う、医師レビューと iPhone 用データ作成のためのPC管理アプリです。

## できること

1. **疾患カード**
   - 下書きカードを一覧表示
   - 下書きのみで絞り込み
   - 下書き・承認済みカードをフォームで編集
   - 必要な時だけJSON原文を開いて詳細編集
   - 下書きを承認済みに変更
   - 不要な下書き・承認済みカードを確認付きで退避削除

2. **辞書・鑑別グラフ・検索index**
   - `finding-concepts.json` の概念ラベル・同義語・tokens・反対所見をフォームで編集
   - 必要な時だけ辞書JSON原文を開いて直接編集
   - 辞書候補・鑑別グラフ・検索indexをボタンで再生成

3. **iPhone用ファイル**
   - ローカルデータのバックアップを作成
   - 全体点検を実行
   - `radiology-ddx-pack.zip` を作成
   - OneDriveフォルダを選択
   - iPhoneで読み込む ZIP packをOneDriveへコピー

## 起動方法

Windowsで次を実行します。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File apps\pc-admin\pc-admin-gui.ps1
```

または、以下をダブルクリックします。

```text
apps\pc-admin\Start-PC-Admin-GUI.bat
```

## CLI

Codexや自動処理から使うために、同じ操作を行うCLIも残しています。

```powershell
node apps\pc-admin\pc-admin.js status
node apps\pc-admin\pc-admin.js approve-draft glioblastoma
node apps\pc-admin\pc-admin.js maintenance
node apps\pc-admin\pc-admin.js export-mobile "C:\Users\<you>\OneDrive\RadiologyDDX"
```

通常の手作業はGUI、Codexからの一括処理や検証はCLI、という使い分けを想定しています。
