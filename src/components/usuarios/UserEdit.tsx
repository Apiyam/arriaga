import { useForm } from "@refinedev/react-hook-form";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useList } from "@refinedev/core";
import { useParams } from "react-router";
import { UserAccount } from "@/types/entities";
import { PermissionsManager } from "./PermissionsManager";
import { useState, useEffect } from "react";

export const UserEdit = () => {
  const { id } = useParams();
  const [permissions, setPermissions] = useState<Record<string, string>>(() => {
    const initialPerms: Record<string, string> = {};
    const permissionKeys = ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10", "O11", "O12", "O13", "O14", "O15", "O16", "O17", "O18", "O19", "O20", "O21", "O22", "O23", "O24", "O25"];
    permissionKeys.forEach(key => {
      initialPerms[key] = "False";
    });
    return initialPerms;
  });

  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserAccount>({
    refineCoreProps: {
      resource: "user_accounts",
      id: id,
      action: "edit",
      redirect: "list",
    },
  });

  const currentPermissions = watch("permissions");

  useEffect(() => {
    if (currentPermissions) {
      try {
        const parsed = typeof currentPermissions === 'string' 
          ? JSON.parse(currentPermissions) 
          : currentPermissions;
        if (parsed && typeof parsed === 'object') {
          setPermissions(parsed);
        }
      } catch (e) {
        console.error("Error parsing permissions:", e);
      }
    }
  }, [currentPermissions]);

  const handlePermissionsChange = (newPermissions: Record<string, string>) => {
    setPermissions(newPermissions);
    setValue("permissions", JSON.stringify(newPermissions));
  };

  const handleFormSubmit = async (data: any) => {
    data.permissions = JSON.stringify(permissions);
    await onFinish(data);
  };

  const { data: rolesData } = useList({
    resource: "user_roles",
    pagination: { mode: "off" },
  });

  return (
    <AppLayout 
      title="Editar Usuario" 
      description="Modifica la información del usuario"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                {...register("first_name", { required: true })}
                className="mt-1"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">Apellido *</Label>
              <Input
                id="last_name"
                {...register("last_name", { required: true })}
                className="mt-1"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="user_role">Rol</Label>
              <select
                id="user_role"
                {...register("user_role")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Seleccionar rol...</option>
                {rolesData?.data?.map((role: any) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>
          </div>

          {/* Permisos */}
          <div className="mt-6">
            <PermissionsManager 
              permissions={permissions} 
              onChange={handlePermissionsChange} 
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Guardando..." : "Actualizar Usuario"}
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

