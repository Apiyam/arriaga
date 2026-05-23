import { useShow, useNavigation } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { Edit, ArrowLeft, Users } from "lucide-react";
import { UserAccount } from "@/types/entities";

export const UserShow = () => {
  const { id } = useParams();
  const { edit } = useNavigation();
  const { queryResult } = useShow<UserAccount>({
    resource: "user_accounts",
    id: id,
  });

  const { data, isLoading } = queryResult;
  const user = data?.data;

  if (isLoading) {
    return (
      <AppLayout title="Cargando..." description="">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout title="Usuario no encontrado" description="">
        <Card className="p-6">
          <p>El usuario solicitado no existe.</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={`${user.first_name} ${user.last_name}`} 
      description="Información completa del usuario"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <Button
            onClick={() => edit("user_accounts", user.id)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nombre</h3>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                {user.first_name} {user.last_name}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-lg">{user.email || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Rol</h3>
              <p className="text-lg">{user.user_role || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 1 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {user.status === 1 ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Registro</h3>
              <p className="text-lg">
                {user.register_date 
                  ? new Date(user.register_date).toLocaleDateString('es-ES')
                  : "-"
                }
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Último Acceso</h3>
              <p className="text-lg">
                {user.last_login_date 
                  ? new Date(user.last_login_date).toLocaleDateString('es-ES')
                  : "Nunca"
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

