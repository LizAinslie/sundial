export { default } from "next-auth/middleware";

export const config = { matcher: ["/", "/password-reset", "/admin/:page"] };
