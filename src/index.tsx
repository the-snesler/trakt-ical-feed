import { Hono } from "hono";
import type { AppEnv } from "./lib/types";

import home from "./routes/home";
import auth from "./routes/auth";
import dashboard from "./routes/dashboard";
import feed from "./routes/feed";

const app = new Hono<AppEnv>();

app.route("/", home);
app.route("/auth", auth);
app.route("/dashboard", dashboard);
app.route("/feed", feed);

export default app;
