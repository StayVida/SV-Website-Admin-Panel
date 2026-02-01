export const formatImageSource = (src: string) => {
    if (!src) return "";
    if (src.startsWith("data:") || src.startsWith("http")) return src;

    // Detect image type from base64 start characters
    if (src.startsWith("UklGR")) return `data:image/webp;base64,${src}`;
    if (src.startsWith("/9j/")) return `data:image/jpeg;base64,${src}`;
    if (src.startsWith("iVBORw0KGgo")) return `data:image/png;base64,${src}`;

    // Fallback to jpeg for other base64 strings
    return `data:image/jpeg;base64,${src}`;
};
