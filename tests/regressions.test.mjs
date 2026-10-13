import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);

function loadTs(relativePath, globals = {}, cache = new Map()) {
    const filename = path.resolve(root, relativePath);
    if (cache.has(filename)) return cache.get(filename);
    const compiledModule = { exports: {} };
    cache.set(filename, compiledModule.exports);
    const localRequire = name => {
        if (name.startsWith(".") || name.startsWith("@/")) {
            const target = name.startsWith("@/") ? path.join(root, "src", name.slice(2)) : path.resolve(path.dirname(filename), name);
            if (target.endsWith(".json")) return JSON.parse(fs.readFileSync(target, "utf8"));
            const file = [target + ".ts", target + ".tsx"].find(candidate => fs.existsSync(candidate));
            return loadTs(path.relative(root, file), globals, cache);
        }
        return require(name);
    };
    const js = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
        fileName: filename,
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(js, { module: compiledModule, exports: compiledModule.exports, require: localRequire, console, Date, URL, TypeError, AbortSignal, process, setTimeout, clearTimeout, setInterval, clearInterval, ...globals }, { filename });
    return compiledModule.exports;
}

const streams = loadTs("src/lib/stream-sources.ts");
const source = (id, url) => ({ id, name: "English", url, quality: "HD", region: "Primary" });

test("match times use explicit timezones, including a date rollover", () => {
    const { formatMatchTime } = loadTs("src/lib/match-time.ts");
    const timestamp = Date.UTC(2026, 9, 14, 20, 30);
    const utc = formatMatchTime(timestamp, "UTC");
    const dhaka = formatMatchTime(timestamp, "Asia/Dhaka");
    assert.equal(utc.time, "20:30");
    assert.equal(utc.date, "14 Oct");
    assert.equal(dhaka.time, "02:30");
    assert.equal(dhaka.date, "15 Oct");
});

test("server-rendered match times have a stable UTC hydration snapshot", () => {
    const { LocalMatchTime } = loadTs("src/components/ui/LocalMatchTime.tsx");
    const html = renderToString(React.createElement(LocalMatchTime, { timestamp: Date.UTC(2026, 9, 14, 20, 30), timeClassName: "", dateClassName: "" }));
    assert.match(html, /20:30/);
    assert.match(html, /14 Oct/);
    assert.match(html, /Match time in UTC/);
});

test("approved banner zones are unique on each page, including the shared footer", () => {
    const { ADS_CONFIG } = loadTs("src/lib/ads.ts", { process: { env: {} } });
    for (const page of ["home", "matches", "stream"]) {
        const snippets = Object.entries(ADS_CONFIG.placements)
            .filter(([placement, snippet]) => (placement.startsWith(page) || placement === "footer") && snippet)
            .map(([, snippet]) => snippet);
        assert.equal(snippets.length, 3);
        assert.equal(new Set(snippets).size, snippets.length);
    }
    assert.ok(ADS_CONFIG.popunder && ADS_CONFIG.inPage && ADS_CONFIG.video);
    assert.equal(new URL(ADS_CONFIG.smartlinkUrl).protocol, "https:");
});

test("a rotated URL cannot interrupt the active connection", () => {
    const current = source("admin:match:1", "https://embed.example/old-token");
    const refreshed = source(current.id, "https://embed.example/new-token");
    assert.equal(streams.preserveStreamConnection(current, [refreshed]), current);
});

test("a missing source or temporary empty list preserves the playing connection", () => {
    const current = source("chosen", "https://embed.example/chosen");
    assert.equal(streams.preserveStreamConnection(current, [source("backup", "https://embed.example/backup")]), current);
    assert.equal(streams.preserveStreamConnection(current, []), current);
});

test("new sources can start an initially empty player", () => {
    const first = source("first", "https://embed.example/first");
    assert.equal(streams.preserveStreamConnection(undefined, []), undefined);
    assert.equal(streams.preserveStreamConnection(undefined, [first]), first);
});

test("source identity survives reordering and invalid URLs are filtered", () => {
    const a = { source: "admin", id: "fixture", streamNo: 1, embedUrl: "https://embed.example/a", hd: true };
    const b = { source: "admin", id: "fixture", streamNo: 2, embedUrl: "https://embed.example/b" };
    const original = streams.normalizeStreamSources([a, b]);
    const reordered = streams.normalizeStreamSources([b, { ...a, embedUrl: "https://embed.example/rotated" }]);
    assert.equal(original[0].id, reordered[1].id);
    assert.equal(original[1].id, reordered[0].id);
    assert.equal(streams.normalizeStreamSources([null, { embedUrl: "javascript:alert(1)" }, { embedUrl: "" }]).length, 0);
});

test("an empty-source StreamClient renders without crashing", () => {
    const { StreamClient } = loadTs("src/components/stream/StreamClient.tsx");
    const match = { id: "fixture", title: "Home vs Away", homeTeam: { name: "Home" }, awayTeam: { name: "Away" }, status: "upcoming", timestamp: Date.now() + 60000 };
    assert.match(renderToString(React.createElement(StreamClient, { match, servers: [] })), /Loading Stream/);
});

test("World Cup is absent from both classification and filter catalog", () => {
    const leagues = loadTs("src/lib/leagues.ts");
    assert.equal(leagues.getAllKnownLeagues().some(league => league.name === "World Cup"), false);
    assert.equal(leagues.detectLeague("Argentina", "Brazil", "FIFA World Cup").leagueName, "Other");
    assert.equal(leagues.getAllKnownLeagues().some(league => league.id === "other"), true);
});

test("status transitions at kickoff and live phase uses the supplied clock", () => {
    const api = loadTs("src/lib/api.ts");
    const kickoff = 1800000000000;
    assert.equal(api.getMatchStatus(kickoff, kickoff - 1), "upcoming");
    assert.equal(api.getMatchStatus(kickoff, kickoff), "live");
    assert.equal(api.calculateLiveMinute(kickoff, kickoff + 30000), "First Half");
    assert.equal(api.getMatchStatus(kickoff, kickoff + 10800000), "finished");
});

test("equal-time unknown leagues follow priority leagues", async () => {
    const date = Date.now() + 3600000;
    const data = [
        { id: "unknown", title: "Unknown A vs Unknown B", date, teams: { home: { name: "Unknown A" }, away: { name: "Unknown B" } } },
        { id: "priority", title: "Arsenal vs Chelsea", date, teams: { home: { name: "Arsenal" }, away: { name: "Chelsea" } } },
    ];
    const api = loadTs("src/lib/api.ts", { fetch: async () => ({ ok: true, json: async () => ({ data }) }) });
    assert.equal((await api.getUpcomingMatches())[0].id, "priority");
});

test("same-league live matches sort by time", async () => {
    const now = Date.now();
    const data = [
        { id: "later", title: "Arsenal vs Chelsea", date: now - 600000, teams: { home: { name: "Arsenal" }, away: { name: "Chelsea" } } },
        { id: "earlier", title: "Liverpool vs Everton", date: now - 3600000, teams: { home: { name: "Liverpool" }, away: { name: "Everton" } } },
    ];
    const api = loadTs("src/lib/api.ts", { fetch: async () => ({ ok: true, json: async () => ({ data }) }) });
    assert.equal((await api.getLiveMatches())[0].id, "earlier");
});

function detectionEnvironment({ hidden = false, online = true, probeError = false, responseOk = true, connectionError = false } = {}) {
    let nodes = 0;
    const environment = {
        navigator: { onLine: online },
        document: {
            createElement: () => ({ style: {}, className: "", isConnected: true, get offsetHeight() { return hidden && this.className ? 0 : 1; }, setAttribute() {}, remove() { nodes--; } }),
            body: { appendChild() { nodes++; } },
        },
        window: { setTimeout: callback => { callback(); }, getComputedStyle: () => ({ display: hidden ? "none" : "block", visibility: "visible" }) },
        fetch: async url => {
            if (connectionError) throw new TypeError("Connection failed");
            if (probeError && url.startsWith("/ads/")) throw new TypeError("Blocked by client");
            return { ok: responseOk };
        },
    };
    return { environment, remainingNodes: () => nodes };
}

for (const [name, options, expected] of [
    ["normal browser", {}, "clear"],
    ["cosmetic ad blocking", { hidden: true }, "blocked"],
    ["blocked probe request with working connectivity", { probeError: true }, "blocked"],
    ["offline browser", { online: false }, "unknown"],
    ["network failure", { connectionError: true }, "unknown"],
    ["missing probe/server error", { responseOk: false }, "unknown"],
]) {
    test(`adblock detection: ${name}`, async () => {
        const { environment, remainingNodes } = detectionEnvironment(options);
        const { detectAdBlocking } = loadTs("src/lib/adblock.ts", environment);
        assert.equal(await detectAdBlocking(), expected);
        assert.equal(remainingNodes(), 0);
    });
}
