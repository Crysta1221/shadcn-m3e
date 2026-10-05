
import { useMemo, useState } from "react";
import { Palette } from "@/lib/tokens";
import { CATEGORIES, PARTS, partBySlug, type PartCategory } from "@/parts/registry";
import { nameOf } from "@/parts/labels";
import { Icon } from "./M3Node";
import { t, useLang } from "@/lib/i18n";
import { Field, Section, Tile } from "./ui";

/* The palette lists the shadcn M3E components, in the docs' categories and under the docs' names. */
const CATEGORY_ICON: Record<PartCategory, string> = {
  Actions: "touch_app",
  Selection: "toggle_on",
  "Text inputs": "text_fields",
  Communication: "campaign",
  Containment: "web_asset",
  Navigation: "explore",
  Menus: "menu",
  Pickers: "calendar_month",
  Content: "notes",
  Chat: "forum",
  Theming: "palette",
};

const CATEGORY_TEXT = {
  ja: { Actions: "操作", Selection: "選択", "Text inputs": "テキスト入力", Communication: "通知・状態", Containment: "コンテナ", Navigation: "ナビゲーション", Menus: "メニュー", Pickers: "ピッカー", Content: "コンテンツ", Chat: "チャット", Theming: "テーマ" },
  zh: { Actions: "操作", Selection: "选择", "Text inputs": "文本输入", Communication: "通知与状态", Containment: "容器", Navigation: "导航", Menus: "菜单", Pickers: "选择器", Content: "内容", Chat: "聊天", Theming: "主题" },
  ko: { Actions: "동작", Selection: "선택", "Text inputs": "텍스트 입력", Communication: "알림 및 상태", Containment: "컨테이너", Navigation: "내비게이션", Menus: "메뉴", Pickers: "선택기", Content: "콘텐츠", Chat: "채팅", Theming: "테마" },
} satisfies Record<string, Record<PartCategory, string>>;

export function PartsPalette({
  palette: p,
  favorites,
  onToggleFavorite,
  onPartPointerDown,
  onPartActivate,
}: {
  palette: Palette;
  /** the slugs of the starred parts */
  favorites: string[];
  onToggleFavorite: (slug: string) => void;
  onPartPointerDown: (e: React.PointerEvent, slug: string) => void;
  /** a tile chosen with the keyboard or a screen reader adds its part without a drag */
  onPartActivate: (slug: string) => void;
}) {
  const lang = useLang();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PARTS;
    return PARTS.filter((d) => d.name.toLowerCase().includes(s) || nameOf(d, lang).toLowerCase().includes(s) || d.slug.includes(s));
  }, [q, lang]);

  const tile = (slug: string) => {
    const d = partBySlug(slug);
    if (!d) return null;
    return (
      <Tile
        key={slug}
        icon={d.icon}
        label={nameOf(d, lang)}
        p={p}
        onPointerDown={(e) => onPartPointerDown(e, slug)}
        onClick={() => onPartActivate(slug)}
        starred={favorites.includes(slug)}
        onStar={() => onToggleFavorite(slug)}
      />
    );
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(78px, 1fr))",
    gap: 6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <div style={{ padding: "12px 12px 8px" }}>
        <Field value={q} onChange={setQ} placeholder={t("search", lang)} p={p} icon="search" height={40} />
      </div>

      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0 8px" }}>
        {!q && favorites.length > 0 && (
          <Section id="fav" icon="star" title={t("favorites", lang)} p={p}>
            <div style={grid}>{favorites.map(tile)}</div>
          </Section>
        )}
        {q ? (
          <div style={{ ...grid, padding: "4px 4px 12px" }}>
            {filtered.map((d) => tile(d.slug))}
            {filtered.length === 0 && (
              <div role="status" style={{ gridColumn: "1 / -1", color: p.outline, fontSize: 13, padding: 12, textAlign: "center", display: "grid", placeItems: "center", gap: 6 }}>
                <Icon name="search_off" size={28} />
                <span>{t("noMatch", lang)}</span>
              </div>
            )}
          </div>
        ) : (
          CATEGORIES.map((c) => {
            const inCategory = PARTS.filter((d) => d.category === c);
            if (inCategory.length === 0) return null;
            return (
              <Section key={c} id={`cat:${c}`} icon={CATEGORY_ICON[c]} title={lang === "en" ? c : CATEGORY_TEXT[lang][c]} p={p}>
                <div style={grid}>{inCategory.map((d) => tile(d.slug))}</div>
              </Section>
            );
          })
        )}
      </div>

    </div>
  );
}
