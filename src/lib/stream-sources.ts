export interface StreamSource {
    id: string;
    name: string;
    url: string;
    hd: boolean;
    viewers: number;
}

export interface StreamServer {
    id: string;
    name: string;
    url: string;
    quality: string;
    region: string;
    viewers?: number;
}

const stringValue = (value: unknown) => typeof value === "string" ? value.trim() : "";

export function normalizeStreamSources(raw: unknown): StreamSource[] {
    if (!Array.isArray(raw)) return [];
    const ids = new Map<string, number>();
    return raw.flatMap((item, index) => {
        if (!item || typeof item !== "object") return [];
        const source = item as Record<string, unknown>;
        const url = stringValue(source.url) || stringValue(source.embedUrl) || stringValue(source.src);
        try {
            if (!["https:", "http:"].includes(new URL(url).protocol)) return [];
        } catch {
            return [];
        }
        const identity = [source.source || "provider", source.id || "stream", source.streamNo ?? `${source.language || source.name || "source"}-${source.hd ? "hd" : "sd"}`].join(":");
        const duplicate = ids.get(identity) || 0;
        ids.set(identity, duplicate + 1);
        return [{
            id: duplicate ? `${identity}:${duplicate}` : identity,
            name: stringValue(source.language) || stringValue(source.name) || `Source ${index + 1}`,
            url,
            hd: source.hd === true,
            viewers: typeof source.viewers === "number" && Number.isFinite(source.viewers) ? Math.max(0, source.viewers) : 0,
        }];
    });
}

export function toStreamServers(sources: StreamSource[]): StreamServer[] {
    return sources.map((source, index) => ({
        id: source.id,
        name: source.name,
        url: source.url,
        quality: source.hd ? "HD" : "SD",
        region: index === 0 ? "Primary" : `Backup ${index}`,
        viewers: source.viewers,
    }));
}

// A rotated or missing provider URL does not prove that the playing iframe failed.
export function preserveStreamConnection(current: StreamServer | undefined, available: StreamServer[]): StreamServer | undefined {
    return current || available[0];
}
