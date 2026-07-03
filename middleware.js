import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Protege todo lo que empiece con /admin, MENOS la página de login.
  matcher: ["/admin/((?!login).*)"],
};
