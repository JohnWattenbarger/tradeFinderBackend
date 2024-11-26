// export interface ProxyRequest {
//     targetUrl: string;
//     headers?: { [key: string]: string };
//     cookies?: { [key: string]: string };
// }

export interface ProxyRequestBody {
    url: string;
    cookies: Record<string, string>;
    headers?: Record<string, string>;
    method?: string;
    body?: any;
}
