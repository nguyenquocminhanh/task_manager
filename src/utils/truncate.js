export function truncate(text) {
    const MAX_LENGTH = 20
    const truncated = text.length > MAX_LENGTH ? text.substring(0, MAX_LENGTH) + "..." : text;
    return truncated;
}