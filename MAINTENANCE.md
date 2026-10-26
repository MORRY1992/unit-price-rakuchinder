# SOL / Claude / Codex 共通の更新手順

更新日: 2026-10-26。公開名: 単価比較ラクチンダー。先に AGENTS.md を読む。

## 正本と公開

- 正本はこの GitHub リポジトリの main。公開URLは https://unit-price-rakuchinder.pages.dev/ 。
- HTML/CSS/JavaScript の編集対象は public/index.html。単一ファイル・外部ライブラリなし。
- 公開前は必ず現在の main を取得し、並行編集があれば取り込む。旧セッションのコードを丸ごと上書きしない。
- Git 連携の Cloudflare Pages が public を公開する。コミット後、公開HTMLと主操作で反映を確認する。
- 戻す場合は対象の変更を revert して新しいコミットにする。履歴の強制上書きをしない。

## 変更点と維持する仕様

g/kg・ml/Lの換算、商品代金は全袋合計・量は1袋、BigIntによる丸め前の比較。旧保存 rakuchin-unit-comparison-v1 を読み込み可能。

名前付き保存は5件まで。このブラウザー内のみ。キー `rakuchin-unit-profiles-v2`。自動保存・自動復元を追加しない。既存データの読込互換を維持する。保存形式変更時は旧保存を試す。削除後はページを閉じるまで取り消せる。

CSS は末尾の再デザイン定義にまとめてある。アイボリー背景、ネイビー/ティールの主面、ゴールドの主操作。スマホの1列配置、safe-area、フォーカス表示、reduced-motion を保持。

## 公開前の確認

```sh
node tests/quality.cjs unit-price-rakuchinder
node tests/retention.cjs public/index.html
```

1. 正常入力と空欄・不正値、例示入力、コピー、保存→変更→呼出し、削除→取消を画面確認。
2. ページを再読込し、操作して保存したデータだけを呼び出せることを確認。価格は都度更新する旨を保持。
3. スマホ幅、ラベル、横溢れ、JSエラー、広告と入力欄の誤クリック誘発を確認。
4. 所有権メタタグ・canonical・ads.txt・robots.txt・sitemap.xml・楽天紹介リンク・広告表記・運営情報を不用意に変更しない。
5. 内部コードネームを本文・メタデータ・画像へ入れない。APIキーやパスワードをHTMLへ入れない。

広告審査の通過・売上・アクセス増加は、改修やテスト成功とは別の未確定事項。測定や審査結果なしに達成と報告しない。
