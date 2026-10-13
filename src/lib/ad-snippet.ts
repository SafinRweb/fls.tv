// Only operator-configured, provider-issued ad HTML belongs here.
export function appendAdSnippet(container: HTMLElement, snippet: string): void {
    if (!snippet.trim()) return;
    const template = document.createElement("template");
    template.innerHTML = snippet;
    for (const node of Array.from(template.content.childNodes)) {
        if (node instanceof HTMLScriptElement) {
            const script = document.createElement("script");
            for (const attribute of Array.from(node.attributes)) script.setAttribute(attribute.name, attribute.value);
            script.textContent = node.textContent;
            container.appendChild(script);
        } else container.appendChild(node.cloneNode(true));
    }
}
