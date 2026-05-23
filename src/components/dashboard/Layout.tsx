import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { FiMenu } from "react-icons/fi";

export const AppLayout = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar para desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar para mobile */}
      {sidebarOpen && (
        <Sidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col md:ml-72">
        {/* Botón móvil */}
        <div className="md:hidden p-4 bg-white shadow-sm flex justify-between items-center">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <FiMenu size={24} />
          </button>
          <h1 className="text-lg font-bold">{title}</h1>
        </div>

        <main className="flex-1 md:p-6 sm:p-1">
          <div className="md:p-6 sm:p-1">
            <div className="rounded-none shadow-xl border border-gray-300 bg-white">
              <div className="pb-4 border-b border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
                <p className="mt-1 text-gray-500">{description}</p>
              </div>
              <div className=" p-6">
                {children}
              </div>
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </div>
  );
};