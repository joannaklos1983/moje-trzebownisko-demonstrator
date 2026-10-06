"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { ACTION_BUTTON_LABELS, ADMIN_CHANNELS } from "@/data/admin";
import { CATEGORIES } from "@/data/categories";
import { AUDIENCE_GROUPS } from "@/data/localities";
import { MESSAGE_TYPE_ORDER, MESSAGE_TYPES } from "@/data/messageTypes";
import { campaignLabels, campaignSummary } from "@/lib/campaign";
import { useAppActions, useAppState } from "@/lib/store";
import type { AudienceGroup, CampaignForm as Form, Category } from "@/types";

const SECTION = { display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid #E6ECE8", paddingTop: 16 } as const;
const RADIO = { accentColor: "#2F824F", margin: 0, width: 16, height: 16 } as const;
const NEW_TAG = <span className="tagn">DO DODANIA W SYSTEMIE</span>;

function Select({ id, value, options, onChange }: { id: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative" }}>
      <select id={id} className="a-sel" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icon name="chevD" size={18} style={{ position: "absolute", right: 10, top: 10, pointerEvents: "none" }} />
    </div>
  );
}

function PublishButton({ label, onClick, style }: { label: string; onClick: () => void; style: React.CSSProperties }) {
  return <button className="btn" style={style} onClick={onClick}><Icon name="send" size={16} />{label}</button>;
}

function Section({ num, title, children }: { num: number; title: ReactNode; children: ReactNode }) {
  return (
    <section style={SECTION}>
      <h3 className="a-sec"><span className="a-num">{num}</span>{title}</h3>
      {children}
    </section>
  );
}

/* Formularz „Dodaj / Edytuj kampanię”: rozbudowa istniejącego formularza. Pola w bursztynowej ramce
   to nowe pola względem obecnego systemu. Typ (jak pilne) i Kategoria (czego dotyczy) to osobne pola. */
export function CampaignForm() {
  const state = useAppState();
  const { dispatch, publish } = useAppActions();
  const f = state.form;
  const set = (patch: Partial<Form>) => dispatch({ type: "patchForm", patch });
  const labels = campaignLabels(state.published.length > 0);

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px 12px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 11.5, color: "#5A6670" }}>Powiadomienia › Kampanie</div>
          <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700 }}>{labels.heading}</h2>
        </div>
        <PublishButton label={labels.publishLabel} onClick={publish} style={{ fontSize: 14, padding: "10px 16px", minHeight: 40, borderRadius: 10 }} />
      </div>

      <Section num={1} title="Podstawowe informacje">
        <div>
          <label className="a-lbl" htmlFor="a-name">Nazwa kampanii</label>
          <input id="a-name" className="a-inp" value={f.name} onChange={(e) => set({ name: e.target.value })} />
          <p className="a-hint">Nazwa robocza – widzi ją tylko administrator.</p>
        </div>
        <div>
          <span className="a-lbl">Typ komunikatu</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {MESSAGE_TYPE_ORDER.map((t) => {
              const on = f.type === t;
              return (
                <label key={t} style={{ border: `1.5px solid ${on ? "#2F824F" : "#DFE6E2"}`, background: on ? "#F1F8F3" : "#FFFFFF", borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 4, cursor: "pointer" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700 }}><input type="radio" name="a-type" checked={on} onChange={() => set({ type: t })} style={RADIO} />{MESSAGE_TYPES[t].label}</span>
                  <span style={{ fontSize: 11, color: "#5A6670", lineHeight: 1.4 }}>{MESSAGE_TYPES[t].d}</span>
                </label>
              );
            })}
          </div>
          {f.type === "Alert" && <p className="a-hint" style={{ color: "#B3261E", fontWeight: 600 }}>Alert wyłącznie dla właściwych komunikatów RCB / najwyższego stopnia.</p>}
        </div>
        <div className="a-new">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><label className="a-lbl" htmlFor="a-cat" style={{ margin: 0 }}>Kategoria</label>{NEW_TAG}</div>
          <Select id="a-cat" value={f.cat} options={CATEGORIES} onChange={(v) => set({ cat: v as Category })} />
          <p className="a-hint">Kategoria mówi, czego dotyczy komunikat. Zasila filtry Powiadomień, wyszukiwarkę i Ulubione. Nie zastępuje typu.</p>
        </div>
        <div>
          <label className="a-lbl" htmlFor="a-title">Tytuł komunikatu</label>
          <input id="a-title" className="a-inp" value={f.title} onChange={(e) => set({ title: e.target.value })} />
          <p className="a-hint">Co się dzieje + gdzie, np. „Przerwa w dostawie wody – Jasionka”. Widzi go mieszkaniec.</p>
        </div>
      </Section>

      <Section num={2} title="Odbiorcy">
        <div>
          <label className="a-lbl" htmlFor="a-group">Grupa odbiorców</label>
          <Select id="a-group" value={f.group} options={AUDIENCE_GROUPS} onChange={(v) => set({ group: v as AudienceGroup })} />
          <p className="a-hint">Istniejące Grupy kampanii (Powiadomienia › Grupy kampanii). Grupa miejscowości wyznacza też, gdzie komunikat jest pokazywany mieszkańcom – bez osobnego pola lokalizacji. Wybór kilku grup w jednej kampanii: DO SPRAWDZENIA.</p>
        </div>
      </Section>

      <Section num={3} title="Czas">
        <div style={{ display: "flex", gap: 18, fontSize: 13.5 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32, cursor: "pointer" }}><input type="radio" name="a-send" checked={f.sendMode === "now"} onChange={() => set({ sendMode: "now" })} style={RADIO} />Wyślij natychmiast</label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32, cursor: "pointer" }}><input type="radio" name="a-send" checked={f.sendMode !== "now"} onChange={() => set({ sendMode: "sched" })} style={RADIO} />Zaplanuj wysłanie</label>
        </div>
        {f.sendMode !== "now" && (
          <div style={{ maxWidth: 260 }}>
            <label className="a-lbl" htmlFor="a-sendat">Data i godzina wysłania</label>
            <input id="a-sendat" type="datetime-local" className="a-inp" value={f.sendAt} onChange={(e) => set({ sendAt: e.target.value })} />
          </div>
        )}
        <div className="a-new">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><span className="a-lbl" style={{ margin: 0 }}>Okres obowiązywania komunikatu</span>{NEW_TAG}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <div><label className="a-lbl" htmlFor="a-od">Ważne od</label><input id="a-od" type="datetime-local" className="a-inp" value={f.od} onChange={(e) => set({ od: e.target.value })} /></div>
            <div><label className="a-lbl" htmlFor="a-do">Ważne do</label><input id="a-do" type="datetime-local" className="a-inp" value={f.do} onChange={(e) => set({ do: e.target.value })} /></div>
          </div>
          <p className="a-hint">Inne pole niż data wysłania. Po „Ważne do” komunikat znika z „Ważne teraz” i z widoku Aktualne, ale zostaje w historii jako ZAKOŃCZONE. Status wylicza się automatycznie.</p>
        </div>
      </Section>

      <Section num={4} title="Widoczność na ekranie głównym">
        <div className="a-new">
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={f.important} onChange={(e) => set({ important: e.target.checked })} style={{ accentColor: "#2F824F", width: 18, height: 18, margin: "1px 0 0", flex: "none" }} />
            <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700 }}>Pokaż ten komunikat w sekcji „Ważne teraz”{NEW_TAG}</span>
              <span style={{ fontSize: 11.5, color: "#5A6670", lineHeight: 1.45 }}>„Ważne teraz” pokazuje maksymalnie 2–3 aktualne informacje. To wyróżnienie kampanii, a nie osobny typ komunikatu.</span>
            </span>
          </label>
        </div>
      </Section>

      <Section num={5} title="Treść">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 11, fontWeight: 600, color: "#23673D" }}>
          {["co się dzieje", "gdzie", "kiedy", "co ma zrobić mieszkaniec"].map((step, i) => (
            <span key={step} style={{ display: "contents" }}>
              {i > 0 && <span>→</span>}
              <span style={{ background: "#EEF6F1", borderRadius: 999, padding: "3px 9px" }}>{step}</span>
            </span>
          ))}
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><label className="a-lbl" htmlFor="a-text">Kampania web</label><span style={{ fontSize: 11.5, color: "#5A6670" }}>{(f.text || "").length} znaków</span></div>
          <textarea id="a-text" className="a-inp" rows={3} style={{ resize: "vertical", lineHeight: 1.45 }} value={f.text} onChange={(e) => set({ text: e.target.value })} />
          <p className="a-hint">Ta sama treść trafia do aplikacji – nie trzeba jej wpisywać drugi raz.</p>
        </div>
        <div className="a-new">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><label className="a-lbl" htmlFor="a-link" style={{ margin: 0 }}>Link do strony ze szczegółami</label>{NEW_TAG}</div>
          <input id="a-link" className="a-inp" value={f.link} onChange={(e) => set({ link: e.target.value })} />
          <p className="a-hint">Opcjonalnie. Konkretna strona komunikatu, harmonogram lub mapa – nie strona główna.</p>
        </div>
        {/* kanały są wyłącznie symulowane – nic nie jest wysyłane */}
        <div style={{ border: "1px solid #E6ECE8", borderRadius: 10 }}>
          {ADMIN_CHANNELS.map((c) => (
            <label key={c.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid #EEF2EF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <span style={{ flex: 1 }}>{c.label}</span>
              <span style={{ fontSize: 11.5, color: "#5A6670", fontWeight: 500 }}>{f[c.key] ? "włączona" : "wyłączona"}</span>
              <input type="checkbox" checked={f[c.key]} onChange={(e) => set({ [c.key]: e.target.checked })} style={RADIO} />
            </label>
          ))}
        </div>
        <p className="a-hint" style={{ marginTop: -4 }}>Kanały jak w obecnym panelu. Push i e-mail – zgodnie z tym, co obsługuje system (DO SPRAWDZENIA).</p>
      </Section>

      <Section num={6} title={<>Szczegóły / działanie {NEW_TAG}</>}>
        <div>
          <span className="a-lbl">Nazwa przycisku w aplikacji</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ACTION_BUTTON_LABELS.map((b) => {
              const on = f.btn === b;
              return (
                <label key={b} style={{ display: "flex", alignItems: "center", gap: 7, border: `1.5px solid ${on ? "#2F824F" : "#DFE6E2"}`, background: on ? "#F1F8F3" : "#FFFFFF", borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                  <input type="radio" name="a-btn" checked={on} onChange={() => set({ btn: b })} style={{ accentColor: "#2F824F", margin: 0, width: 14, height: 14 }} />{b}
                </label>
              );
            })}
          </div>
          <p className="a-hint">Przycisk prowadzi do linku z sekcji 5 albo do pełnego komunikatu w aplikacji.</p>
        </div>
      </Section>

      <Section num={7} title="Podsumowanie">
        <div style={{ background: "#F5F8F4", borderRadius: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "150px 1fr", rowGap: 7, columnGap: 12, fontSize: 12.5 }}>
          {campaignSummary(f).map((s) => (
            <span key={s.k} style={{ display: "contents" }}>
              <span style={{ color: "#5A6670" }}>{s.k}</span>
              <span style={{ fontWeight: 600 }}>{s.v}</span>
            </span>
          ))}
        </div>
        <p className="a-hint">Jedna kampania = jedno źródło informacji: zasila Powiadomienia, „Ważne teraz”, wyniki wyszukiwania i historię.</p>
        <PublishButton label={labels.publishLabel} onClick={publish} style={{ alignSelf: "flex-end", fontSize: 14, padding: "10px 18px", minHeight: 42, borderRadius: 10 }} />
      </Section>
    </div>
  );
}
