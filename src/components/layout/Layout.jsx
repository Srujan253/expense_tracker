import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-bg">
      <Sidebar />
      <main className="min-h-screen p-4 transition-all md:ml-64 md:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
