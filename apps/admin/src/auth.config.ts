import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const authConfig: AuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = schema.safeParse(raw ?? {});
        if (!parsed.success) return null;

        const { username, password } = parsed.data;
        const ENV_USER = (process.env.ADMIN_USERNAME ?? "").trim();
        const ENV_HASH = (process.env.ADMIN_PASSWORD_HASH ?? "").trim();

        if (!ENV_USER || !ENV_HASH) {
          console.warn("[auth] ADMIN_USERNAME or ADMIN_PASSWORD_HASH missing");
          return null;
        }

        // sanity check the bcrypt hash format
        if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(ENV_HASH)) {
          console.log(ENV_HASH)
          console.warn("[auth] ADMIN_PASSWORD_HASH doesn't look like a bcrypt hash");
          return null;
        }

        if (username !== ENV_USER) return null;

        const ok = await bcrypt.compare(password, ENV_HASH);
        if (!ok) return null;

        return { id: "admin", name: "Admin", username: ENV_USER };
      },
    }),
  ],
};