import { Navbar } from "@/components/layout/navbar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { GuestBanner } from "@/components/layout/guest-banner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <GuestBanner />
      <div className="container mx-auto px-4">
        <Breadcrumbs />
      </div>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
