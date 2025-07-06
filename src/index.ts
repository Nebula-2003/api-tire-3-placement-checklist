import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import users from "./users/users.routes";

const app = new OpenAPIHono();

app.route("/users", users);

app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "The Tire 3 Checklist",
        description: "Tejus's Swagger-compatible Hono backend 💥",
    },
    servers: [
        {
            url: "http://localhost:8787",
            description: "Local dev server",
        },
        {
            url: "https://thetire3checklist.tejusraghavendra09.workers.dev",
            description: "Production server",
        },
    ],
});

app.get("/docs/api", Scalar({ url: "/doc" }));
app.get("/", (c) => c.text("Hono running with Swagger + Scalar 🚀"));

export default app;
