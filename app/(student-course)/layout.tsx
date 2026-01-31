export default function StudentCourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden h-screen flex">
      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
        {children}
      </main>
    </div>
  );
}
