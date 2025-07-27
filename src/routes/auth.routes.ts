import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getMe, loginUser, registerUser } from "../controllers/auth.controller";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schemas";
import { protect } from "../middleware/auth.middleware";

const authRoutes = new Hono();

authRoutes.post("/register", zValidator("json", registerUserSchema), async (c) => {
	return registerUser(c);
});

authRoutes.post("/login", zValidator("json", loginUserSchema), async (c) => {
	return loginUser(c);
});

authRoutes.get("/me", protect, (c) => {
	return getMe(c);
});

export default authRoutes;
