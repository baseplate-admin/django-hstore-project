export class StyleFactory {
    #cssStylesRegistered = false;
    #styleElement?: HTMLStyleElement;

    mountStyles(renderRoot: HTMLElement | DocumentFragment, widgetStyles: string) {
        if (this.#cssStylesRegistered) return;

        const styleEl = document.createElement('style');
        styleEl.textContent = widgetStyles;

        renderRoot.appendChild(styleEl);

        this.#styleElement = styleEl;
        this.#cssStylesRegistered = true;
    }

    getStyleElement() {
        return this.#styleElement;
    }
}
