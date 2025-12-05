export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
