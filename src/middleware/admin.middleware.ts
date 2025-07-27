import type { Context, Next } from "hono";
import { admin, protect } from "./auth.middleware";

export const adminProtect = async (c: Context, next: Next) => {
	await protect(c, async () => { });
	await admin(c, async () => { });
	await next();
};
