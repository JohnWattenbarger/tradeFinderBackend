import Fastify from 'fastify';
import cors from '@fastify/cors';
import { createCookieHeader } from './utils';
import { ProxyRequestBody } from './types';
// import fetch from 'node-fetch';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
    origin: true,
    credentials: true,
});

fastify.post('/proxy', async (request, reply) => {
    const { url, cookies, headers = {}, method, body } = request.body as ProxyRequestBody;

    if (!url || !cookies) {
        reply.status(400).send({ error: 'Missing "url" or "cookies" in request body' });
        return;
    }

    try {
        // Combine cookies into a single string for the "Cookie" header
        // const cookieHeader = Object.entries(cookies)
        //   .map(([key, value]) => `${key}=${value}`)
        //   .join('; ');
        const cookieHeader = createCookieHeader(cookies);

        const proxyResponse = await fetch(url, {
            method: method || 'GET',
            headers: {
                ...headers,
                Cookie: cookieHeader, // Set the combined cookie string
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await proxyResponse.text(); // Use text to handle flexible response types
        reply.status(proxyResponse.status).send(data);
    } catch (error: any) {
        reply.status(500).send({ error: error.message });
    }
});

fastify.listen({ port: 3000 }, err => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log('Fastify server running on http://localhost:3000');
});