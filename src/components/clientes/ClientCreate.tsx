import { useForm } from "@refinedev/react-hook-form";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustom } from "@refinedev/core";
import { supabaseClient } from "@/utility";
import { useState } from "react";

interface ClientData {
  first_name: string;
  last_name: string;
  email: string;
  whatsapp?: string;
  home_phone?: string;
  office_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export const ClientCreate = () => {
  const [formData, setFormData] = useState<ClientData>({
    first_name: "",
    last_name: "",
    email: "",
    whatsapp: "",
    home_phone: "",
    office_phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = "El nombre es requerido";
    if (!formData.last_name) newErrors.last_name = "El apellido es requerido";
    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Crear usuario (cliente con role 1)
      const { data: userData, error: userError } = await supabaseClient
        .from("user_accounts")
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          user_role: 1, // Cliente
          password: "xxxxxxx", // Password por defecto
          status: 1,
          lang: 0,
        })
        .select()
        .single();

      if (userError) throw userError;

      // Crear información adicional del cliente
      if (userData) {
        const { error: infoError } = await supabaseClient
          .from("user_information")
          .insert({
            user_account: userData.id,
            whatsapp: formData.whatsapp || null,
            home_phone: formData.home_phone || null,
            office_phone: formData.office_phone || null,
            address: formData.address || null,
            city: formData.city || null,
            state: formData.state || null,
            zip_code: formData.zip_code || null,
          });

        if (infoError) throw infoError;
      }

      // Redirigir a la lista
      window.location.href = "/clientes";
    } catch (error: any) {
      console.error("Error creating client:", error);
      alert("Error al crear el cliente: " + (error.message || "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout 
      title="Crear Cliente" 
      description="Registra un nuevo cliente en el sistema"
    >
      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first_name">Nombre *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="mt-1"
                required
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">Apellido(s) *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="mt-1"
                required
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="whatsapp">Número de WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="home_phone">Número telefónico de casa</Label>
              <Input
                id="home_phone"
                value={formData.home_phone}
                onChange={(e) => setFormData({ ...formData, home_phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="office_phone">Número telefónico de trabajo</Label>
              <Input
                id="office_phone"
                value={formData.office_phone}
                onChange={(e) => setFormData({ ...formData, office_phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Domicilio</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="zip_code">Código postal</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

