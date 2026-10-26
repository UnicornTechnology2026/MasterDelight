import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LEVELS,
  clearPlayers,
  doneCount,
  getPlayers,
  totalOf,
} from "../lib/store";

const TABS = [
  ["analytics", "Analytics"],
  ["registrations", "Registrations"],
  ["scores", "Scores"],
];
const LEVEL_LABEL = {
  quiz: "Level 1 · Quiz",
  blend: "Level 2 · Blend",
  hunt: "Level 3 · Hunt",
};
const SHORT = { quiz: "L1", blend: "L2", hunt: "L3" };
const RANKS = [
  { name: "Rising Master", min: 0 },
  { name: "Master Blender", min: 500 },
  { name: "Grand Master", min: 750 },
];

const fmtDate = (t) =>
  t
    ? new Date(t).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
const status = (p) => {
  const n = doneCount(p);
  return n === 3 ? "Completed" : n === 0 ? "Not started" : "In progress";
};
const avg = (a) =>
  a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : 0;

function download(name, rows) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: name,
  });
  a.click();
  URL.revokeObjectURL(url);
}

const Card = ({ title, children, className = "" }) => (
  <section
    className={`glass-card rounded-2xl border border-gold/30 p-4 ${className}`}
  >
    {title && (
      <h3 className="mb-3 text-[11px] uppercase tracking-[.2em] text-gold/80">
        {title}
      </h3>
    )}
    {children}
  </section>
);

const Kpi = ({ label, value, sub }) => (
  <Card>
    <p className="text-[10px] uppercase tracking-[.2em] text-white/60">
      {label}
    </p>
    <p className="mt-1 font-display text-4xl leading-none text-gold">{value}</p>
    {sub && <p className="mt-1 text-xs text-white/60">{sub}</p>}
  </Card>
);

const Bar = ({ label, value, max, right }) => (
  <div className="mb-2.5 last:mb-0">
    <div className="mb-1 flex justify-between gap-2 text-xs text-white/85">
      <span className="truncate">{label}</span>
      <span className="shrink-0 font-semibold text-gold">{right ?? value}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-white/15">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#fff1b8] to-[#d8ab45]"
        style={{
          width: `${max ? Math.max(value ? 3 : 0, (value / max) * 100) : 0}%`,
        }}
      />
    </div>
  </div>
);

const Empty = ({ text }) => (
  <p className="py-8 text-center text-sm text-white/60">{text}</p>
);

const th =
  "px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[.15em] text-gold/80";
const td = "px-3 py-2.5 text-sm text-white/90";

function Table({ head, children, empty }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gold/20">
      <table className="w-full min-w-[560px] border-collapse">
        <thead className="bg-black/40">
          <tr>
            {head.map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gold/10">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

function Analytics({ players }) {
  const s = useMemo(() => {
    const completed = players.filter((p) => doneCount(p) === 3);
    const finishedTotals = completed.map(totalOf);
    const perLevel = LEVELS.map((k) => {
      const ds = players.filter((p) => p.done[k]);
      const sc = ds.map((p) => p.scores[k]);
      return {
        k,
        n: ds.length,
        avg: avg(sc),
        best: sc.length ? Math.max(...sc) : 0,
        sum: sc.reduce((a, b) => a + b, 0),
      };
    });
    const cities = Object.entries(
      players.reduce((m, p) => {
        const c = p.city.trim().toLowerCase();
        m[c] = m[c] || { name: p.city.trim(), n: 0 };
        m[c].n++;
        return m;
      }, {}),
    )
      .map(([, v]) => v)
      .sort((a, b) => b.n - a.n)
      .slice(0, 6);
    const ranks = RANKS.map((r, i) => ({
      ...r,
      n: finishedTotals.filter(
        (t) => t >= r.min && (!RANKS[i + 1] || t < RANKS[i + 1].min),
      ).length,
    }));
    return {
      completed: completed.length,
      progress: players.filter((p) => doneCount(p) > 0 && doneCount(p) < 3)
        .length,
      avgTotal: avg(finishedTotals),
      perLevel,
      cities,
      ranks,
    };
  }, [players]);

  const n = players.length;
  const recent = [...players]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 10);
  const funnel = [
    ["Registered", n],
    ...LEVELS.map((k) => [
      `Completed ${SHORT[k]}`,
      players.filter((p) => p.done[k]).length,
    ]),
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Registrations" value={n} />
        <Kpi
          label="Completed all 3"
          value={s.completed}
          sub={n ? `${Math.round((s.completed / n) * 100)}% of players` : ""}
        />
        <Kpi label="In progress" value={s.progress} />
        <Kpi
          label="Avg final score"
          value={s.avgTotal}
          sub="completed players"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Journey funnel">
          {funnel.map(([l, v]) => (
            <Bar
              key={l}
              label={l}
              value={v}
              max={n}
              right={`${v}${n ? ` · ${Math.round((v / n) * 100)}%` : ""}`}
            />
          ))}
        </Card>
        <Card title="Score by level">
          <div className="space-y-3">
            {s.perLevel.map((l) => (
              <div
                key={l.k}
                className="flex items-center justify-between gap-2 rounded-xl border border-gold/20 bg-black/25 px-3 py-2"
              >
                <div>
                  <p className="text-xs text-white/85">{LEVEL_LABEL[l.k]}</p>
                  <p className="text-[11px] text-white/55">
                    {l.n} played · best {l.best}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl leading-none text-gold">
                    {l.avg}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-white/55">
                    avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Ranks (completed players)">
          {s.ranks.map((r) => (
            <Bar
              key={r.name}
              label={r.name}
              value={r.n}
              max={Math.max(1, s.completed)}
            />
          ))}
          <h3 className="mb-3 mt-5 text-[11px] uppercase tracking-[.2em] text-gold/80">
            Top cities
          </h3>
          {s.cities.length ? (
            s.cities.map((c) => (
              <Bar
                key={c.name}
                label={c.name}
                value={c.n}
                max={s.cities[0].n}
              />
            ))
          ) : (
            <p className="text-xs text-white/60">No data yet</p>
          )}
        </Card>
      </div>

      <Card title="Player progress & scores (latest activity)">
        <Table
          head={["Name", "Level 1", "Level 2", "Level 3", "Total", "Status"]}
        >
          {recent.map((p) => (
            <tr key={p.id}>
              <td className={td}>{p.name}</td>
              {LEVELS.map((k) => (
                <td key={k} className={td}>
                  {p.done[k] ? (
                    p.scores[k]
                  ) : (
                    <span className="text-white/35">—</span>
                  )}
                </td>
              ))}
              <td className={`${td} font-display text-lg text-gold`}>
                {totalOf(p)}
              </td>
              <td className={td}>
                <Badge s={status(p)} />
              </td>
            </tr>
          ))}
        </Table>
        {!n && (
          <Empty text="No players yet. Registrations appear here as soon as someone verifies their OTP." />
        )}
      </Card>
    </div>
  );
}

function Badge({ s }) {
  const c =
    s === "Completed"
      ? "border-green-400/60 text-green-300"
      : s === "In progress"
        ? "border-gold/70 text-gold"
        : "border-white/30 text-white/60";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${c}`}>
      {s}
    </span>
  );
}

function Registrations({ players }) {
  const [q, setQ] = useState("");
  const rows = [...players]
    .sort((a, b) => b.registeredAt - a.registeredAt)
    .filter((p) =>
      `${p.name} ${p.city} ${p.mobile}`
        .toLowerCase()
        .includes(q.trim().toLowerCase()),
    );
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, city or mobile"
          className="w-full rounded-md border border-gold/40 bg-black/30 px-3 py-2 font-body text-sm text-white placeholder-white/40 outline-none focus:border-gold sm:w-72"
        />
        <button
          className="btn-ghost bg-black/30 !px-3 !py-1.5 text-sm"
          onClick={() =>
            download("registrations.csv", [
              ["Name", "City", "Mobile", "Registered"],
              ...rows.map((p) => [
                p.name,
                p.city,
                p.mobile,
                new Date(p.registeredAt).toISOString(),
              ]),
            ])
          }
        >
          EXPORT CSV
        </button>
      </div>
      <Table head={["#", "Name", "City", "Mobile", "Registered"]}>
        {rows.map((p, i) => (
          <tr key={p.id}>
            <td className={`${td} text-white/50`}>{i + 1}</td>
            <td className={td}>{p.name}</td>
            <td className={td}>{p.city}</td>
            <td className={td}>+91 {p.mobile}</td>
            <td className={`${td} text-white/60`}>{fmtDate(p.registeredAt)}</td>
          </tr>
        ))}
      </Table>
      {!rows.length && (
        <Empty text={players.length ? "No match" : "No registrations yet"} />
      )}
    </Card>
  );
}

function Scores({ players }) {
  const rows = [...players].sort((a, b) => totalOf(b) - totalOf(a));
  return (
    <Card>
      <div className="mb-3 flex justify-end">
        <button
          className="btn-ghost bg-black/30 !px-3 !py-1.5 text-sm"
          onClick={() =>
            download("scores.csv", [
              ["Name", "Level 1", "Level 2", "Level 3", "Total"],
              ...rows.map((p) => [
                p.name,
                ...LEVELS.map((k) => (p.done[k] ? p.scores[k] : "")),
                totalOf(p),
              ]),
            ])
          }
        >
          EXPORT CSV
        </button>
      </div>
      <Table head={["Rank", "Name", "Level 1", "Level 2", "Level 3", "Total"]}>
        {rows.map((p, i) => (
          <tr key={p.id}>
            <td className={`${td} text-white/50`}>{i + 1}</td>
            <td className={td}>{p.name}</td>
            {LEVELS.map((k) => (
              <td key={k} className={td}>
                {p.done[k] ? (
                  p.scores[k]
                ) : (
                  <span className="text-white/35">—</span>
                )}
              </td>
            ))}
            <td className={`${td} font-display text-lg text-gold`}>
              {totalOf(p)}
            </td>
          </tr>
        ))}
      </Table>
      {!rows.length && <Empty text="No scores yet" />}
    </Card>
  );
}

export default function Admin({ onLogout, onBack }) {
  const [tab, setTab] = useState("analytics");
  const [players, setPlayers] = useState(getPlayers);
  const refresh = useCallback(() => setPlayers(getPlayers()), []);

  // live update: other tabs/windows write to localStorage while people play
  useEffect(() => {
    window.addEventListener("storage", refresh);
    const t = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener("storage", refresh);
      clearInterval(t);
    };
  }, [refresh]);

  const wipe = () => {
    if (
      window.confirm("Delete ALL registrations and scores from this browser?")
    ) {
      clearPlayers();
      refresh();
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="bg-gradient-to-r from-[#fff1b8] via-[#f0cf7a] to-[#d8a63a] bg-clip-text font-display text-3xl uppercase tracking-wide text-transparent">
          Admin Dashboard
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            className="btn-ghost bg-black/30 !px-3 !py-1.5 text-sm"
            onClick={refresh}
          >
            REFRESH
          </button>
          <button
            className="btn-ghost bg-black/30 !px-3 !py-1.5 text-sm"
            onClick={onBack}
          >
            BACK TO GAME
          </button>
          <button
            className="btn-ghost bg-black/30 !px-3 !py-1.5 text-sm"
            onClick={onLogout}
          >
            LOGOUT
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto" role="tablist">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`shrink-0 rounded-lg border px-4 py-2 font-display tracking-wide transition ${tab === k ? "border-gold bg-gold text-maroon" : "border-gold/40 bg-black/30 text-gold hover:bg-gold/10"}`}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </nav>

      {tab === "analytics" && <Analytics players={players} />}
      {tab === "registrations" && <Registrations players={players} />}
      {tab === "scores" && <Scores players={players} />}

      {!!players.length && (
        <button
          onClick={wipe}
          className="self-end text-xs text-white/40 underline underline-offset-2 hover:text-white/70"
        >
          Clear all data
        </button>
      )}
    </div>
  );
}
