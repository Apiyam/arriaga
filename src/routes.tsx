import { Route, Routes, Navigate } from "react-router";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ProceedingList } from "./components/expedientes/ProceedingList";
import { ProceedingCreate } from "./components/expedientes/ProceedingCreate";
import { ProceedingEdit } from "./components/expedientes/ProceedingEdit";
import { ProceedingShow } from "./components/expedientes/ProceedingShow";
import { ProceedingFilesPage } from "./components/expedientes/ProceedingFilesPage";
import { AuditList } from "./components/auditorias/AuditList";
import { AuditCreate } from "./components/auditorias/AuditCreate";
import { AuditEdit } from "./components/auditorias/AuditEdit";
import { BinnacleList } from "./components/bitacoras/BinnacleList";
import { BinnacleCreate } from "./components/bitacoras/BinnacleCreate";
import { BinnacleEdit } from "./components/bitacoras/BinnacleEdit";
import { BinnacleShow } from "./components/bitacoras/BinnacleShow";
import { SpendingList } from "./components/gastos/SpendingList";
import { SpendingCreate } from "./components/gastos/SpendingCreate";
import { SpendingEdit } from "./components/gastos/SpendingEdit";
import { CatalogList } from "./components/catalogos/CatalogList";
import { CatalogForm } from "./components/catalogos/CatalogForm";
import { UserList } from "./components/usuarios/UserList";
import { UserCreate } from "./components/usuarios/UserCreate";
import { UserEdit } from "./components/usuarios/UserEdit";
import { UserShow } from "./components/usuarios/UserShow";
import { AuditShow } from "./components/auditorias/AuditShow";
import { SpendingShow } from "./components/gastos/SpendingShow";
import { ClientList } from "./components/clientes/ClientList";
import { ClientCreate } from "./components/clientes/ClientCreate";
import { ClientEdit } from "./components/clientes/ClientEdit";
import { ClientShow } from "./components/clientes/ClientShow";
import { VisitSheet } from "./components/expedientes/VisitSheet";
import { VisitSheetPrint } from "./components/expedientes/VisitSheetPrint";
import { SettingsPage } from "./components/configuraciones/SettingsPage";

import { LoginRegister } from "./components/dashboard/LoginRegister";
import { useAuthSession } from "./hooks/useAuthSession";

export default function RouterApp() {
  const { user, ready } = useAuthSession();

  if (!ready) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Cargando sesión...
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />
          <Route path="/sign-up" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route index element={<DashboardPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/sign-in" element={<Navigate to="/" replace />} />
          <Route path="/sign-up" element={<Navigate to="/" replace />} />
          <Route path="/expedientes" element={<ProceedingList />} />
          <Route path="/expedientes/create" element={<ProceedingCreate />} />
          <Route path="/expedientes/edit/:id" element={<ProceedingEdit />} />
          <Route path="/expedientes/show/:id" element={<ProceedingShow />} />
          <Route path="/expedientes/:id/archivos" element={<ProceedingFilesPage />} />
          <Route path="/auditorias" element={<AuditList />} />
          <Route path="/auditorias/create" element={<AuditCreate />} />
          <Route path="/auditorias/edit/:id" element={<AuditEdit />} />
          <Route path="/auditorias/show/:id" element={<AuditShow />} />
          <Route path="/bitacoras" element={<BinnacleList />} />
          <Route path="/bitacoras/create" element={<BinnacleCreate />} />
          <Route path="/bitacoras/edit/:id" element={<BinnacleEdit />} />
          <Route path="/bitacoras/show/:id" element={<BinnacleShow />} />
          <Route path="/gastos" element={<SpendingList />} />
          <Route path="/gastos/create" element={<SpendingCreate />} />
          <Route path="/gastos/edit/:id" element={<SpendingEdit />} />
          <Route path="/gastos/show/:id" element={<SpendingShow />} />
          <Route
            path="/catalogos/juntas"
            element={
              <CatalogList resource="meeting_catalogs" title="Catálogo de Juntas" description="Gestiona el catálogo de juntas" />
            }
          />
          <Route
            path="/catalogos/juntas/create"
            element={<CatalogForm resource="meeting_catalogs" title="Crear Junta" description="Registra una nueva junta" />}
          />
          <Route
            path="/catalogos/juntas/edit/:id"
            element={<CatalogForm resource="meeting_catalogs" title="Editar Junta" description="Modifica la información de la junta" />}
          />
          <Route
            path="/catalogos/exhortos"
            element={
              <CatalogList resource="exhort_catalogs" title="Catálogo de Exhortos" description="Gestiona el catálogo de exhortos" />
            }
          />
          <Route
            path="/catalogos/exhortos/create"
            element={<CatalogForm resource="exhort_catalogs" title="Crear Exhorto" description="Registra un nuevo exhorto" />}
          />
          <Route
            path="/catalogos/exhortos/edit/:id"
            element={<CatalogForm resource="exhort_catalogs" title="Editar Exhorto" description="Modifica la información del exhorto" />}
          />
          <Route
            path="/catalogos/estados-procesales"
            element={
              <CatalogList
                resource="process_state_catalogs"
                title="Catálogo de Estados Procesales"
                description="Gestiona el catálogo de estados procesales"
              />
            }
          />
          <Route
            path="/catalogos/estados-procesales/create"
            element={
              <CatalogForm resource="process_state_catalogs" title="Crear Estado Procesal" description="Registra un nuevo estado procesal" />
            }
          />
          <Route
            path="/catalogos/estados-procesales/edit/:id"
            element={
              <CatalogForm resource="process_state_catalogs" title="Editar Estado Procesal" description="Modifica la información del estado procesal" />
            }
          />
          <Route
            path="/catalogos/licenciados"
            element={
              <CatalogList
                resource="lic_catalogs"
                title="Catálogo de Licenciados"
                description="Gestiona el catálogo de licenciados"
                nameField="full_name"
              />
            }
          />
          <Route
            path="/catalogos/licenciados/create"
            element={
              <CatalogForm
                resource="lic_catalogs"
                title="Crear Licenciado"
                description="Registra un nuevo licenciado"
                fields={[{ name: "full_name", label: "Nombre Completo", required: true }]}
              />
            }
          />
          <Route
            path="/catalogos/licenciados/edit/:id"
            element={
              <CatalogForm
                resource="lic_catalogs"
                title="Editar Licenciado"
                description="Modifica la información del licenciado"
                fields={[{ name: "full_name", label: "Nombre Completo", required: true }]}
              />
            }
          />
          <Route path="/usuarios" element={<UserList />} />
          <Route path="/usuarios/create" element={<UserCreate />} />
          <Route path="/usuarios/edit/:id" element={<UserEdit />} />
          <Route path="/usuarios/show/:id" element={<UserShow />} />
          <Route path="/clientes" element={<ClientList />} />
          <Route path="/clientes/create" element={<ClientCreate />} />
          <Route path="/clientes/edit/:id" element={<ClientEdit />} />
          <Route path="/clientes/show/:id" element={<ClientShow />} />
          <Route path="/expedientes/hoja-visita/:id" element={<VisitSheet />} />
          <Route path="/expedientes/hoja-visita/:id/print" element={<VisitSheetPrint />} />
          <Route path="/configuraciones" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}
