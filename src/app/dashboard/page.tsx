import { LogoutButton } from "@/components/logout-button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-lg mb-2">
                Welcome, {session.user?.name || session.user?.email}!
              </p>
              <p className="text-gray-600">Email: {session.user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
