# Playground 仕上げ：本家差分の全対応＋ダイアログ配置・ローカライズ修正

`~/.claude/plans/cozy-sprouting-locket.md` の計画を引き継ぎ、本家（lnkiai/m3e-canvas）との差分の再監査・現在の進捗・新規の指摘（ダイアログの呼び出しボタン／配置、日本語 UI に残る英語）を反映した実施計画。

## Context

- 前提: monorepo 化・canvas の subtree 取り込み・79 部品の実コンポーネント描画・開いた状態の描画・Play モードの操作・Dialog の 2 スタイルは完了済み（〜2a60bb8）。
- **上流差分**: 本家の HEAD は取り込み時点の 039ec31 のまま。追いつくべき差分は新規コミットではなく、旧 37 種の独自描画部品にあった編集機能で、`kind:"component"` の新部品から見えなくなっているもの。
- **作業中（未コミット）**: Phase 1 の大半が作業ツリーに存在する。
  - `parts/resize.ts` 新設（`resizeOf` / `numberValue` / `labelOfPart` / `isFabPart`）
  - `app/Editor.tsx`: `componentAxes` でハンドル・矢印キー微調整・FAB アンカー・開いた部品の z-index=1
  - `components/ComponentInspector.tsx`: `width` prop に `WidthRows`（半幅/内容幅/画面幅）
  - `components/Layers.tsx`: `labelOfPart` でレイヤー名
  - `components/Mobile.tsx`: モバイルインスペクタにノート欄（トリガーは未実装）
  - `parts/registry.ts`: `defaultOpen` → `open:true` の制御化（キャンバスのクリックで閉じないため）
- **新規要求（今回の指摘）**:
  1. 本家にはダイアログを呼び出すボタンは無い。こちらでは `trigger`/`variant` prop が描画されないまま残っている。→ **本家同様に除去し、ダイアログの位置だけ設定できるようにする**（ユーザー決定済み）。
  2. 開いた状態の箱（420×260 等）がオーバーレイ本体より大きく、選択枠と見た目がずれる。→ **箱をオーバーレイ実測に合わせる**（ユーザー決定済み）。
  3. UI は日本語なのに prop ラベル・部品名・選択肢が英語のまま。→ 一通りローカライズ。

## 本家との差分（洗い出し）

### A. 部品カバレッジ — 既決方針: 新部品は追加しない

旧 37 種のうち専用描画しか無いもの（box / text / image / camera / map / 連結 list・chip group / インライン bottom sheet）は作らず、既存部品の props 拡張で近づける。パレットは docs の 79 件のまま。旧描画・旧インスペクタ（約 4.3k 行）は残す。

### B. props 差分（監査 B1–B21）

| 対象                         | 追加する prop                                                                                       | ライブラリ変更 |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | -------------- |
| Button / Switch              | `width`                                                                                             | 不要 (S)       |
| Button（アイコンのみ）       | `width="narrow\|wide"`                                                                              | 不要 (S)       |
| FAB                          | `lowered` / `collapsed`                                                                             | 不要 (S)       |
| Split button                 | メニュー項目アイコン（`menuItems` を `icons` 化）                                                   | 不要 (S)       |
| App bar                      | 末尾アイコン複数・`scrolled`                                                                        | 不要 (S)       |
| Navigation bar               | `badge` / `layout` / `elevated`                                                                     | 不要 (S)       |
| Navigation rail              | `modal` / `compact`                                                                                 | 不要 (S)       |
| Search                       | `leading`                                                                                           | 不要 (S)       |
| Text field                   | `value`                                                                                             | 不要 (S)       |
| Date/Time picker             | `defaultView` / 幅                                                                                  | 不要 (S)       |
| Dialog                       | 基本幅（`width`(basic)）                                                                            | 不要 (S)       |
| Tabs                         | アイコン・横スクロール                                                                              | 不要 (S)       |
| Chip                         | 高さ 32/40/56（`chipVariants` に size）・`InputChip`（削除ボタン）                                  | 要 (M)         |
| Progress / Circular progress | `thickness`                                                                                         | 要 (M)         |
| Select                       | filled・`label`/`supporting`                                                                        | 要 (M)         |
| Search                       | `outlined`                                                                                          | 要 (M)         |
| Expressive carousel          | full-screen レイアウト                                                                              | 要 (M)         |
| Card                         | 画像（上/下/左/右/背景）・画像サイズ・`textAlign`/`contentAlign`・`size`・`interactive`・塗り・角丸 | 大 (L)         |
| Item                         | 末尾アイコン/スイッチ・`size`・複数行（`items` → `ItemGroup`）                                      | (S)            |
| Chip                         | `items` で複数個（Chip group 相当）                                                                 | (S)            |
| Drawer                       | `inline`（標準ボトムシートの描画）                                                                  | (S)            |
| Carousel                     | `src`・`itemWidth`・`gap`・枚数 2–8                                                                 | (S)            |
| ButtonGroup                  | 各項目の `variant`/`width`                                                                          | (S)            |

### C. 挙動差分（`item.kind` 分岐から component が見えない箇所）

| #   | 機能                                                                                 | 本家の実装箇所                                                 | component 対応の現状                                                                      |
| --- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| C1  | リサイズハンドル・矢印キー                                                           | `Editor.tsx` HANDLED/WIDE/TALL/ROUND, `sizeDragSpec`           | **作業中**: number prop（`width`/`height`/`size`）は配線済。enum `size`（XS–XL 吸着）は未 |
| C2  | 幅・サイズのプリセット行                                                             | `WidthRows`/`NamedSizes`（`PartPanel.tsx`）                    | width 済。**size enum→`NamedSizes` 未**                                                   |
| C3  | フレーム変更時の bar 追従・nav-bar↔nav-rail 入替                                     | `carryItemSize`/`fitHeight`/`swapNav`（`tidy.ts`/`tokens.ts`） | 未（props 対応が必要）                                                                    |
| C4  | Tidy の配置（top/bottom/floating/fab/overlay/rail/label/control/fullWidth/listLike） | `tidy.ts` の `u.kind` 分岐・`holdsEdgeBar`・`FULL_WIDTH`       | 未（`PartDef.role` で判定へ）                                                             |
| C5  | 塗りロール（10 トークン）                                                            | `FillRun`                                                      | 未（`PartDef.appearance`）                                                                |
| C6  | 角丸（4 隅可）                                                                       | `CornerRows`/`EdgeCornerRows`                                  | 未（同上）                                                                                |
| C7  | スロットごとのタップ（`tab:N`/`icon`/`icon2`/menu）                                  | `actionSlotsOf`/`SlotStrip`/`CardStrip`/`TriggerSection`       | 未（`PartDef.slots(p)`＋`data-tap`）                                                      |
| C8  | プレビュー選択状態・画面またぎ共有（navKey）                                         | `Preview.tsx` navKind/values                                   | 未（`PartDef.selectKey`＋`viewOf` 上書き）                                                |
| C9  | トグル（押したときの見た目）・Rail 展開・メニュー開閉                                | `flippedLook`/`toggle`/`changeRail`/select menu                | 未。ライブラリに `selectedIcon`/`selectedLabel` 追加                                      |
| C10 | 画像（`src` data URL）                                                               | `ImageRow`/`readImage`                                         | 未（`PropDef.kind:"image"`。共有時は `shareable()` で除外）                               |
| C11 | 最初のテキストを呼び名に                                                             | `nameOf`（Layers）・prompt                                     | Layers 済（作業中）。**prompt.ts の `componentText` は未**                                |
| C12 | プロンプトの STYLE_NOTES・レール・リスト文言                                         | `prompt.ts`                                                    | 未（`roleOf` 経由へ）                                                                     |
| C13 | 接続された行（ボタン/リスト融合）                                                    | `connect`/runs                                                 | 未（button-group/toggle-group/Item 複数行で代替＋Tidy のまとめ選択肢）                    |
| C14 | FAB の角アンカー                                                                     | `fabAnchor`                                                    | 済（`isFabPart`。Phase 2 で `role==="fab"` に一般化）                                     |
| C15 | ローカライズ（部品名・prop 名）                                                      | `KIND_TEXT`/`UI`（i18n.ts）                                    | 未。**Phase 0 へ前倒し＋拡大**                                                            |
| C16 | モバイルインスペクタのトリガー/ノート                                                | `Mobile.tsx`                                                   | ノート済・**トリガー未**（作業中）                                                        |
| —   | 開いた部品の z-index・controlled open                                                | `registry.ts`/`Editor.tsx`                                     | 済（作業中の変更）                                                                        |

### D. 旧スケッチ移行

`ButtonInspector`/`PartInspector` に「新部品に変換」ボタン。`migrateLegacy(item)` が旧 `Item` を `component`+`props` に変換（`item.legacy` に旧データ保持で undo 可・非破壊）。可逆マッピング（D4）と損失あり（D5 → 確認ダイアログに失う項目を列挙）。変換先の無い種別（text, image, camera, map, box, bottomSheet）はボタンを出さず旧描画のまま。

## 設計の軸（確定）

- 機能は `item.kind` ではなく **PartDef のメタデータ**で決める。`PartDef` に足すもの:
  - `role`（tidy/プロンプト用の役割: `top|bottom|floatingBottom|fab|overlay|rail|label|control|listLike|fullWidth`）
  - `resize`（`width`/`height`/`size` のどの props がハンドルに対応。`when` で無効化される prop は軸から外す）
  - `slots(p)`（タップ先の一覧）
  - `appearance`（塗り色・角丸を持つか）
  - `selectKey`（プレビューで選択状態を持つ prop）
  - `open.fit`（新規: トリガー非表示のオーバーレイは中身を実測して箱に反映）
- `PropDef` に足すもの:
  - `when?: (p: P) => boolean`（新規: basic/full-screen 等の条件付き表示。`(basic)`/`(full-screen)` 接尾辞を廃す）
  - `labels?: Partial<Record<Lang,string>>`（新規: ja/zh/ko の表示名）
  - `kind:"image"`（Phase 3）
- コード出力は常に `treeOf`（Tailwind の動的クラスは使わない: 固定の文字列マップか `style`）。

## フェーズ（各フェーズ単独で通る状態でコミット）

### Phase 0 — 今回の指摘: ダイアログ系＋ローカライズ

1. **トリガー prop 除去**（`parts/defs/containment.ts`）: `dialog`/`alert-dialog`/`sheet`/`drawer`（`open.trigger==="hide"` の 4 件）から `trigger`（Button label/Link text）と `variant`（Button variant）を削除。`tree` には固定のトリガーを残す（`<DialogTrigger render={<Button variant="tonal" />}>Open dialog</DialogTrigger>` 等 = 旧 codegen と同じ既定）。ボタンを置きたい場合は別途 `button` 部品を配置（位置は自在）。
   - `popover`/`hover-card`/`menus`/`select`/`combobox`/`tooltip`/`navigation-menu` はトリガーが描画されているので据え置き。
2. **Contained fit-to-overlay**: `Contained` に `fit` を追加し、`open.trigger==="hide"` の部品で有効化。`useLayoutEffect` で箱内の `[data-slot$="-popup"], [data-slot$="-content"]`（dialog-content / alert-dialog-content / sheet-content / drawer-popup）を実測し、その矩形（x,y,w,h）を箱自体の矩形にする。中央寄せ・辺張り付きどちらも 1 パスで収束する。結果、アイテムの箱=オーバーレイ本体となり「部品の位置=ダイアログの位置」。初期 box は描画開始点として残す（基本 dialog は 560px まで来るので初期値は大きめに）。
   - `overflow:hidden` は scrim（inset-0）も箱に切るために残すが、fit 後は影が切れないよう採用矩形にシャドウ分の余白（片側 ~16px）は付けない。代わりに fit 時は `overflow:visible` に切替え（scrim は箱=ダイアログ矩形に覆い隠されるため見えない）。
   - 計測レイヤー（`m3-measure`）でも同じ経路で実測されるため `widths` はオーバーレイ実測値になる。
3. **`PropDef.when`**: `reader`/`ComponentProps`/`resizeOf`/`check-codegen`/`defaultValues` が可視 prop だけを見るようにする。dialog の `(basic)`/`(full-screen)` 接尾 prop を `when` 化（基本は位置のみ=本家同様、full-screen は width/height が効く）。同パターンは他部品（chip の `Selected (filter)` 等）にも適用。
4. **ローカライズ（C15 前倒し・拡大）**: `PartDef.name`・`PropDef.label`・`Choice`（`{value,label}` の label 側のみ。`"elevated"` 等のコード値は訳さない）に `labels` を追加し、`labelOf(def,lang)` ヘルパで `t()` と同じく `useLang()` 経由で表示。対象: 全 prop ラベル（共有辞書で一意約 60 種を先に、部品固有は個別に）＋全 79 部品名を ja/zh/ko。パレット・インスペクタ・Layers・モバイル・検索・`PartHeader` が全部ここを通るようにする。`translateDefaultText` と同等に、テキスト prop の既定値も主要部品は言語別既定（`defaults`）に対応（dialog の title/description 等）。
   - `i18n.parity.test.ts` に「全言語で `labels` を持つ/持たないの整合」を追加。

### Phase 1 — 基本の編集操作（C1, C2, C11, C14, C16）: 作業中分の完成＋コミット

- enum `size` prop を持つ部品（button/toggle/fab/chip 等）のハンドル: enum 値 XS–XL ↔ 高さの対応表（`SIZES` ラベルの dp 値）に吸着させる `size` 軸を `resizeOf` に追加。
- enum `size` → `NamedSizes`（`ui.tsx`）、`MobileComponentInspector` に `TriggerSection`。
- prompt.ts `componentText` の呼び名も `labelOfPart` 経由に。
- `resizeOf`/`componentAxes` を `when` 対応（Phase 0 後）。`sizePatch` は PropDef min/max でクランプ済みだが enum 吸着もここ。
- 作業中の変更をこのフェーズのコミットとしてまとめる。

### Phase 2 — Tidy とプロンプト（C3, C4, C12）

- `PartDef.role` を追加し、`lib/tidy.ts` の `u.kind` 分岐・`FULL_WIDTH`・`holdsEdgeBar`、`prompt.ts` の `STYLE_NOTES`・レール・リスト文言を `roleOf(item)` 経由に。
- `carryItemSize`/`fitHeight` を props 対応に（bar の `props.width` がフレームに追従）。`navigation-bar`↔`navigation-rail` の入れ替えを slug で判定。

### Phase 3 — 塗り色・角丸・画像（C5, C6, C10）

- `PartDef.appearance` を持つ部品（Card, Item, Alert, Sheet, Drawer, Carousel, Empty…）に共通「Appearance」セクション: 塗りロール（10 トークン）・文字ロール・角丸（4 隅可）。固定 Tailwind クラス対応表＋`style.borderRadius`。
- `PropDef` に `kind:"image"`（`ImageRow`/`readImage` 再利用）。コード出力はプレースホルダパス。`shareable()` で component の画像 prop も除外する。

### Phase 4 — スロットごとのタップとプレビュー状態（C7, C8, C9）

- `PartDef.slots(p)` → `data-tap` 属性（`print.ts` が除去）。`actionSlotsOf` が部品にも答え、`SlotStrip`/`CardStrip` を再利用。`LivePart` はクリックを `closest("[data-tap]")` に委譲。
- `PartDef.selectKey` を `viewOf` で上書き。同じ目的地を持つバーは画面をまたいで共有（旧 `navKey` 相当）。Rail 展開/折りたたみ、メニュー開閉。live プレビューでは `open` 強制を外して実コンポーネントに開閉させる（trigger-hide 部品は強制のまま）。
- トグル: 旧 `toggle` をボタン/FAB 部品の prop＋「トグル」アクションに（ライブラリ側 `selectedIcon`/`selectedLabel`）。

### Phase 5 — 部品の props 拡張（B1–B21、上表）

- S（ライブラリ変更不要）から着手。M は `packages/m3e` に後方互換で入れ `registry:build`・docs の props 表・例を更新。Card（L）と Item 複数行・Chip items・Drawer inline・Carousel 画像は Phase 3 の `appearance`/`image` と一緒に。

### Phase 6 — 接続された行（C13）

- `button-group`/`toggle-group`/Item 複数行で代替。隣接 Button を Tidy が 1 つの `button-group` にまとめる選択肢（`role` ベース、挙動は小さく）。`ButtonGroup` の各項目に `variant`/`width`。

### Phase 7 — 旧スケッチの変換と仕上げ（D）

- 「新部品に変換」ボタン＋`migrateLegacy`（`item.legacy` 保持・undo 可・D4 可逆/D5 損失は確認ダイアログ）。変換先の無い種別はボタン非表示。
- docs: Playground ガイド更新、`check:codegen`・テスト拡張。

## 検証

- 単体: `apps/canvas` の `bun run test`（resize の値変換・enum 吸着、`roleOf`、Tidy 配置、`migrateLegacy` 往復、`viewOf` 選択状態、画像 prop のコード出力、`when`/`fit` の矩形、i18n parity）。
- 型: `bun run check:codegen`（追加 props の既定値・enum・bool・`when` 分岐を全部型検査）、ルート `typecheck`/`lint`/`format`、`registry:build`・`check:icons`、canvas の静的ビルド。
- ブラウザ（実測）:
  - ダイアログ: basic は箱=ダイアログ本体・位置だけ変更可（ハンドル無し）、full-screen はハンドルで幅/高さ、トリガー系 prop がインスペクタに出ない・生成コードには `DialogTrigger` が出る
  - 日本語: パレット/インスペクタ/選択肢が日本語化されること（en/zh/ko でも確認）
  - 各部品: ハンドルと props が一致、Tidy、Play で Tabs/Nav/Rail 切替、画像、旧スケッチ「新部品に変換」→ undo。コンソールエラー無し、スマホ幅も。

## リスクと注意

- 規模が大きい（C1/C4/C7 と Card が中心）。フェーズごとにコミットし、各フェーズの最後に旧・新両スケッチで動作確認。
- `packages/m3e` のライブラリ変更（Phase 4・5）は配布物に影響 → 後方互換＋docs・registry 同時更新。
- 旧コードは残すので、Tidy/プロンプトは当面「旧種別」と「部品の role」の両方を扱う。
- 画像の data URL は共有リンクを肥大化させる → `shareable()` で component の画像 prop も `src` 同様に除外。
- Contained fit は初期 1 フレームだけ箱が大きく見える（`useLayoutEffect` で収束・不可視）。メニュー等 trigger 表示部品には適用しない。
- `PropDef.when` 追加で `defaultValues`/`check-codegen`/共有 JSON の後方互換に注意（`props` に古いキーが残っていても `reader` が無害化すること）。
