import { Hono } from 'hono';
import { Scalar } from '@scalar/hono-api-reference';
import { z } from '@hono/zod-openapi';
import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown';
import { OpenAPIHono } from '@hono/zod-openapi';
import users from './users/users.routes';

const app = new OpenAPIHono();

app.route('/users', users);
// --- Step 1: Define OpenAPI metadata (must be before routes)
app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'My API',
        description: 'Tejus\'s Swagger-compatible Hono backend 💥',
    },
    servers: [
        {
            url: 'http://localhost:8787',
            description: 'Local dev server',
        },
        {
            url: 'https://thetire3checklist.tejusraghavendra09.workers.dev',
            description: 'Production server',
        },
    ],
});

// --- Step 2: Mount routes

// --- Step 3: Host Scalar (Swagger UI)
app.get('/docs/api', Scalar({ url: '/doc' }));

// --- Step 4: Markdown docs (from OpenAPI JSON)
app.get('/docs.md', async (c) => {
    const markdown = await createMarkdownFromOpenApi(app.openapi.docs);
    return c.text(markdown, 200, {
        'Content-Type': 'text/markdown',
    });
});

// --- Step 5: Home
app.get('/', (c) => c.text('Hono running with Swagger + Scalar 🚀'));

export default app;
