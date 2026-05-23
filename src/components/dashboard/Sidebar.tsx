import { Link, useLocation } from "react-router";
import { useState } from "react";
import { FiHome, FiUsers, FiBell, FiFileText, FiBookOpen } from "react-icons/fi";
import { Activity, DollarSign, Calendar, TrendingUp, DiamondPlus, Settings } from "lucide-react";
import clsx from "clsx";
import { useLogout } from "@refinedev/core";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Dashboard", icon: <FiHome /> },
  { path: "/expedientes", label: "Expedientes", icon: <FiFileText /> },
  { path: "/auditorias", label: "Auditorías", icon: <FiBell /> },
  { path: "/bitacoras", label: "Bitácoras", icon: <Activity className="w-5 h-5" /> },
  { path: "/gastos", label: "Gastos", icon: <DollarSign className="w-5 h-5" /> },
  {
    label: "Catálogos",
    icon: <FiBookOpen />,
    children: [
      { path: "/catalogos/juntas", label: "Juntas", icon: <Calendar className="w-4 h-4" /> },
      { path: "/catalogos/exhortos", label: "Exhortos", icon: <FiFileText className="w-4 h-4" /> },
      { path: "/catalogos/estados-procesales", label: "Estados Procesales", icon: <TrendingUp className="w-4 h-4" /> },
      { path: "/catalogos/licenciados", label: "Licenciados", icon: <FiUsers className="w-4 h-4" /> },
    ],
  },
  { path: "/usuarios", label: "Usuarios", icon: <FiUsers /> },
  { path: "/clientes", label: "Clientes", icon: <FiUsers className="w-5 h-5" /> },
  { path: "/configuraciones", label: "Configuraciones", icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar = ({ isMobile = false, onClose }: { isMobile?: boolean; onClose?: () => void }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const { user } = useAuthSession();
  const { mutate: logout } = useLogout();

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      className={clsx(
        "bg-gray-800 text-white flex flex-col transition-all duration-300 z-40 shadow-lg w-72",
        isMobile ? "fixed top-0 left-0 h-full" : "h-screen fixed top-0 left-0"
      )}
    >
      <div className="flex-shrink-0 border-b border-blue-900">
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white p-3 shadow-md flex items-center justify-center size-24 shrink-0 select-none">
              <img src="/logo.png" alt="Arriaga asociados" className="max-h-full max-w-full h-auto w-auto object-contain" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-3 border-t border-blue-900 justify-start">
          {user && (
            <Button type="button" variant="secondary" size="sm" className="shrink-0" onClick={() => logout()}>
              Salir
            </Button>
          )}
          <div>
            <p className="font-semibold text-white truncate max-w-[160px]" title={user?.email ?? ""}>
              {user?.email ?? "Sesión"}
            </p>
            <p className="text-sm text-gray-200 flex items-center gap-2">
              <DiamondPlus className="w-4 h-4" /> Usuario
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-1 py-3 space-y-1">
          {navItems.map((item) => {
            if ("children" in item) {
              const isOpen = expandedMenus[item.label] || location.pathname.startsWith(item.children[0].path);

              return (
                <div key={item.label} className="mx-2">
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={clsx(
                      "group w-full flex items-center gap-4 px-4 py-2 font-medium rounded-lg transition-colors border-none",
                      isOpen
                        ? "bg-blue-900 text-white shadow-md"
                        : "bg-transparent text-blue-100 hover:bg-blue-900 hover:text-white"
                    )}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className="ml-auto text-xs">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="pl-12 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => onClose?.()}
                            className={clsx(
                              "block px-2 p-2 rounded-md text-sm transition-colors border-none no-underline",
                              isChildActive
                                ? "bg-blue-900 text-white"
                                : "text-blue-100 hover:text-white hover:bg-blue-900"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose?.()}
                className={clsx(
                  "no-underline group relative flex items-center gap-4 rounded-lg px-4 py-2 mx-2 font-medium transition-colors duration-200 select-none",
                  isActive
                    ? "bg-blue-900 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-900 hover:text-white"
                )}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <footer className="flex-shrink-0 px-4 py-3 border-t border-blue-900 text-center text-xs text-blue-200 select-none">
        © {new Date().getFullYear()} Arriaga asociados. Desarrollo por{" "}
        <a href="https://apiyam.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600">
          APIYAM
        </a>
      </footer>
    </aside>
  );
};
