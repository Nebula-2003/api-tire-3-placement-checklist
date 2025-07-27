import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import admin from "./routes/admin.routes";
import auth from "./routes/auth.routes";
import categories from "./routes/category.routes";
import checklist from "./routes/checklist.routes";
import users from "./routes/users.routes";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

app.use("*", cors());

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return err.getResponse();
	}
	return c.json({ message: err.message }, 500);
});

app.route("/api/users", users);
app.route("/api/auth", auth);
app.route("/api/categories", categories);
app.route("/api/checklist", checklist);
app.route("/api/admin", admin);

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
	components: {
		securitySchemes: {
			Bearer: {
				type: "http",
				scheme: "bearer",
			},
		},
	},
});

app.get("/docs/api", Scalar({ url: "/doc" }));
app.get("/", (c) => c.text("Hono running with Swagger + Scalar 🚀"));

export default app;
