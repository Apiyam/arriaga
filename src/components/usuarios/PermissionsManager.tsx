import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Permission {
  key: string;
  label: string;
  access?: boolean;
  edit?: boolean;
  delete?: boolean;
}

interface PermissionsManagerProps {
  permissions: Record<string, string>;
  onChange: (permissions: Record<string, string>) => void;
}

const permissionGroups: Permission[] = [
  { key: "O1", label: "Fichas", access: true, edit: true, delete: true },
  { key: "O4", label: "Fichas (oculto)", access: false, edit: false, delete: false },
  { key: "O5", label: "Agenda/consulta dinámica", access: true, edit: false, delete: false },
  { key: "O6", label: "Agenda/consulta general", access: true, edit: false, delete: false },
  { key: "O7", label: "Catálogos/Licenciados", access: true, edit: true, delete: true },
  { key: "O10", label: "Catálogos/Juntas", access: true, edit: true, delete: true },
  { key: "O13", label: "Catálogos/Estados procesales", access: true, edit: true, delete: true },
  { key: "O16", label: "Catálogos/Tipos de Audiencia", access: true, edit: true, delete: true },
  { key: "O19", label: "Catálogos/Lugares de exhorto", access: true, edit: true, delete: true },
  { key: "O22", label: "Accesos", access: true, edit: false, delete: false },
  { key: "O23", label: "Regeneración", access: true, edit: false, delete: false },
  { key: "O24", label: "Respaldo", access: true, edit: false, delete: false },
  { key: "O25", label: "Restauración", access: true, edit: false, delete: false },
];

export const PermissionsManager = ({ permissions, onChange }: PermissionsManagerProps) => {
  const handlePermissionChange = (key: string, value: boolean) => {
    const newPermissions = { ...permissions };
    newPermissions[key] = value ? "True" : "False";
    onChange(newPermissions);
  };

  const getPermissionValue = (key: string): boolean => {
    return permissions[key] === "True";
  };

  const mainPermissions = permissionGroups.filter(p => !p.label.includes("oculto") && p.label !== "Agenda/consulta general" && p.label !== "Catálogos/Tipos de Audiencia");
  const utilityPermissions = permissionGroups.filter(p => 
    p.label === "Accesos" || 
    p.label === "Regeneración" || 
    p.label === "Respaldo" || 
    p.label === "Restauración"
  );

  return (
    <div className="space-y-6">
      {/* Permisos principales */}
      <Card className="p-4">
        <Label className="text-lg font-semibold mb-4 block">Permisos del Sistema</Label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-sm font-medium text-gray-700">Característica</th>
                <th className="text-center p-3 text-sm font-medium text-gray-700">Acceso</th>
                <th className="text-center p-3 text-sm font-medium text-gray-700">Editar</th>
                <th className="text-center p-3 text-sm font-medium text-gray-700">Borrar</th>
              </tr>
            </thead>
            <tbody>
              {mainPermissions.map((perm) => {
                if (perm.key === "O1") {
                  return (
                    <tr key={perm.key} className="border-b">
                      <td className="p-3 font-medium">Fichas (Expedientes)</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O1")}
                          onChange={(e) => handlePermissionChange("O1", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O2")}
                          onChange={(e) => handlePermissionChange("O2", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O3")}
                          onChange={(e) => handlePermissionChange("O3", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                    </tr>
                  );
                }
                if (perm.key === "O5") {
                  return (
                    <tr key={perm.key} className="border-b">
                      <td className="p-3 font-medium">Agenda/consulta dinámica</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O5")}
                          onChange={(e) => handlePermissionChange("O5", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">-</td>
                      <td className="p-3 text-center">-</td>
                    </tr>
                  );
                }
                if (perm.key === "O7") {
                  return (
                    <tr key={perm.key} className="border-b">
                      <td className="p-3 font-medium">Catálogos/Licenciados</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O7")}
                          onChange={(e) => handlePermissionChange("O7", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O8")}
                          onChange={(e) => handlePermissionChange("O8", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O9")}
                          onChange={(e) => handlePermissionChange("O9", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                    </tr>
                  );
                }
                if (perm.key === "O10") {
                  return (
                    <tr key={perm.key} className="border-b">
                      <td className="p-3 font-medium">Catálogos/Juntas</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O10")}
                          onChange={(e) => handlePermissionChange("O10", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O11")}
                          onChange={(e) => handlePermissionChange("O11", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O12")}
                          onChange={(e) => handlePermissionChange("O12", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                    </tr>
                  );
                }
                if (perm.key === "O13") {
                  return (
                    <tr key={perm.key} className="border-b">
                      <td className="p-3 font-medium">Catálogos/Estados procesales</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O13")}
                          onChange={(e) => handlePermissionChange("O13", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O14")}
                          onChange={(e) => handlePermissionChange("O14", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O15")}
                          onChange={(e) => handlePermissionChange("O15", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                    </tr>
                  );
                }
                if (perm.key === "O19") {
                  return (
                    <tr key={perm.key} className="border-b">
                      <td className="p-3 font-medium">Catálogos/Lugares de exhorto</td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O19")}
                          onChange={(e) => handlePermissionChange("O19", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O20")}
                          onChange={(e) => handlePermissionChange("O20", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={getPermissionValue("O21")}
                          onChange={(e) => handlePermissionChange("O21", e.target.checked)}
                          className="w-4 h-4"
                        />
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Menú de Utilerías */}
      <Card className="p-4">
        <Label className="text-lg font-semibold mb-4 block">Menú de Utilerías</Label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-sm font-medium text-gray-700">Característica</th>
                <th className="text-center p-3 text-sm font-medium text-gray-700">Acceso</th>
                <th className="text-center p-3 text-sm font-medium text-gray-700">Editar</th>
                <th className="text-center p-3 text-sm font-medium text-gray-700">Borrar</th>
              </tr>
            </thead>
            <tbody>
              {utilityPermissions.map((perm) => (
                <tr key={perm.key} className="border-b">
                  <td className="p-3 font-medium">{perm.label}</td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={getPermissionValue(perm.key)}
                      onChange={(e) => handlePermissionChange(perm.key, e.target.checked)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

