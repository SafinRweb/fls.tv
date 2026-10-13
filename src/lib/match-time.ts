const formatters = new Map<string, { time: Intl.DateTimeFormat; date: Intl.DateTimeFormat }>();

export function formatMatchTime(timestamp: number, timeZone: string) {
    let formats = formatters.get(timeZone);
    if (!formats) {
        formats = {
            time: new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
            date: new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit", month: "short" }),
        };
        formatters.set(timeZone, formats);
    }
    return { time: formats.time.format(timestamp), date: formats.date.format(timestamp) };
}
