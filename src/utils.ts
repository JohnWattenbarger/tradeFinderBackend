export const createCookieHeader = (cookies: { [key: string]: string }): string => {
    return Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
};
