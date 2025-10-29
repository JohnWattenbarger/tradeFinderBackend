# Trade Finder Backend

A simple proxy server that forwards HTTP requests with cookies and headers. Useful for bypassing browser restrictions like cookie/CORS limitations when making requests to external APIs.

## Why Use This?

Browsers often block requests due to:
- CORS (Cross-Origin Resource Sharing) restrictions
- Cookie limitations on cross-origin requests
- Missing authentication headers

This proxy server runs on the backend and can make these requests without browser restrictions.

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Build and start:
```bash
npm run build
npm run start
```

Server runs on port 3000 (or PORT environment variable).

## Usage

POST to `/proxy` with:
```json
{
  "url": "https://api.example.com/data",
  "cookies": { "session": "abc123" },
  "method": "GET"
}
```

## Hosting

Hosted on Render.com