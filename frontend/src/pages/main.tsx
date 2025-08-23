import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainRouter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 BILKHAYR GYM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainRouter;
