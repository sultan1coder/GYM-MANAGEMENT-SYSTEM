import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainRouter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <footer className="border-t bg-white/80">
        <div className="px-4 py-6 mx-auto text-center max-w-7xl text-slate-600">
          <p>&copy; 2025 FITNESS GYM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainRouter;
