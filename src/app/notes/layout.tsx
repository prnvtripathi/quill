export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <nav className="bg-transparent flex items-center gap-3 p-4 fixed z-10 top-0 left-0 right-0">
        <h2 className="text-2xl font-bold">quill</h2>
      </nav>
      {children}
    </main>
  );
}
