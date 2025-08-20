import { Button } from "@repo/ui/components/button";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...context.orpc.auth.getUser.queryOptions(),
      revalidateIfStale: true,
    });
    if (!user) {
      throw redirect({ to: "/signin" });
    }

    return { user };
  },
});

function DashboardLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 p-2">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold sm:text-4xl">Dashboard Layout</h1>
        <div className="flex items-center gap-2 max-sm:flex-col">
          This is a protected layout:
          <pre className="bg-card text-card-foreground rounded-md border p-1">
            routes/dashboard/route.tsx
          </pre>
        </div>

        <Button type="button" asChild className="w-fit" size="lg">
          <Link to="/">Back to index</Link>
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
