import { Button } from "@repo/ui/components/button";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-card flex flex-col items-center gap-8 rounded-xl border p-10">
        Logo here or whatever
        <form method="GET" className="flex flex-col gap-2">
          <Button
            formAction="/api/auth/discord"
            type="submit"
            size="lg"
            className="bg-[#5865F2] text-white hover:bg-[#5865F2]/80 hover:text-white"
          >
            Sign in with Discord
          </Button>
          <Button
            formAction="/api/auth/github"
            type="submit"
            size="lg"
            className="bg-neutral-700 text-white hover:bg-neutral-700/80 hover:text-white"
          >
            Sign in with GitHub
          </Button>
          <Button
            formAction="/api/auth/google"
            type="submit"
            size="lg"
            className="bg-[#DB4437] text-white hover:bg-[#DB4437]/80 hover:text-white"
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
