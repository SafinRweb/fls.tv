"use client";

import { useSyncExternalStore } from "react";
import { formatMatchTime } from "@/lib/match-time";

const subscribe = () => () => {};
const getViewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTimeZone = () => "UTC";

export function LocalMatchTime({ timestamp, timeClassName, dateClassName }: {
    timestamp: number;
    timeClassName: string;
    dateClassName: string;
}) {
    // Hydrate the same UTC text as the server, then use the viewer's timezone.
    const timeZone = useSyncExternalStore(subscribe, getViewerTimeZone, getServerTimeZone);
    const labels = formatMatchTime(timestamp, timeZone);
    return (
        <time dateTime={new Date(timestamp).toISOString()} title={`Match time in ${timeZone}`} aria-label={`${labels.date}, ${labels.time}, ${timeZone}`} className="flex flex-col">
            <span className={timeClassName}>{labels.time}</span>
            <span className={dateClassName}>{labels.date}</span>
        </time>
    );
}
