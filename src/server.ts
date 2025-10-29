import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createCookieHeader } from './utils';
import { ProxyRequestBody } from './types';
// import fetch from 'node-fetch';

const fastify = Fastify({ logger: true });

// Use the PORT environment variable, with a fallback to 3000 if it's not set
const port = Number(process.env.PORT) || 3000;

// fastify.register(cors, {
//     origin: true,
//     credentials: true,
// });


// Register the CORS plugin
fastify.register(cors, {
    origin: '*',  // This allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specify the allowed headers
});

fastify.post('/proxy', async (request, reply) => {
    const startTime = Date.now();
    const { url, cookies, headers = {}, method, body } = request.body as ProxyRequestBody;

    // Log incoming request details
    fastify.log.info({
        requestId: request.id,
        url,
        method: method || 'GET',
        cookieCount: Object.keys(cookies || {}).length,
        headerCount: Object.keys(headers).length,
        hasBody: !!body,
        timestamp: new Date().toISOString()
    }, 'Proxy request started');

    if (!url || !cookies) {
        const duration = Date.now() - startTime;
        fastify.log.warn({
            requestId: request.id,
            url,
            duration,
            error: 'Missing required fields'
        }, 'Proxy request failed - missing url or cookies');
        reply.status(400).send({ error: 'Missing "url" or "cookies" in request body' });
        return;
    }

    try {
        // Combine cookies into a single string for the "Cookie" header
        // const cookieHeader = Object.entries(cookies)
        //   .map(([key, value]) => `${key}=${value}`)
        //   .join('; ');
        const cookieHeader = createCookieHeader(cookies);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        fastify.log.info({
            requestId: request.id,
            targetUrl: url,
            method: method || 'GET'
        }, 'Making proxy request to target');

        const proxyResponse = await fetch(url, {
            method: method || 'GET',
            headers: {
                ...headers,
                Cookie: cookieHeader, // Set the combined cookie string
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        clearTimeout(timeout);
        const duration = Date.now() - startTime;

        const data = await proxyResponse.text(); // Use text to handle flexible response types

        fastify.log.info({
            requestId: request.id,
            targetUrl: url,
            statusCode: proxyResponse.status,
            responseSize: data.length,
            duration,
            timestamp: new Date().toISOString()
        }, 'Proxy request completed successfully');

        reply.status(proxyResponse.status).send(data);
    } catch (error: any) {
        const duration = Date.now() - startTime;

        fastify.log.error({
            requestId: request.id,
            targetUrl: url,
            errorName: error.name,
            errorMessage: error.message,
            duration,
            timestamp: new Date().toISOString()
        }, 'Proxy request failed');

        const status = error.name === 'AbortError' ? 504 : 500;
        reply.status(status).send({ error: error.message });
    }
});

// Documentation [here](https://fastify.dev/docs/latest/Reference/Server/#listentextresolver)
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    // console.log('Fastify server running on http://localhost:3000');
});
