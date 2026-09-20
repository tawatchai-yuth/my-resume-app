const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-18 flex-col md:flex">
        Navigation
      </div>
      <main className="h-full md:pl-18">{children}</main>
    </div>
  );
};

export default MainLayout;
