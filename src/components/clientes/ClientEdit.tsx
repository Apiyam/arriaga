import { useShow, useCustom } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router";
import { supabaseClient } from "@/utility";
import { useState, useEffect } from "react";

interface ClientData {
  id: number;
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

export const ClientEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState<ClientData>({
    id: 0,
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del cliente
  useEffect(() => {
    const loadClient = async () => {
      if (!id) return;
      
      try {
        // Obtener datos del usuario
        const { data: userData, error: userError } = await supabaseClient
          .from("user_accounts")
          .select("*")
          .eq("id", id)
          .eq("user_role", 1)
          .single();

        if (userError) throw userError;

        // Obtener información adicional
        const { data: infoData, error: infoError } = await supabaseClient
          .from("user_information")
          .select("*")
          .eq("user_account", id)
          .single();

        if (userData) {
          setFormData({
            id: userData.id,
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            whatsapp: infoData?.whatsapp || "",
            home_phone: infoData?.home_phone || "",
            office_phone: infoData?.office_phone || "",
            address: infoData?.address || "",
            city: infoData?.city || "",
            state: infoData?.state || "",
            zip_code: infoData?.zip_code || "",
          });
        }
      } catch (error: any) {
        console.error("Error loading client:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadClient();
  }, [id]);

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
      // Actualizar usuario
      const { error: userError } = await supabaseClient
        .from("user_accounts")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        })
        .eq("id", formData.id);

      if (userError) throw userError;

      // Actualizar o crear información adicional
      const { data: existingInfo } = await supabaseClient
        .from("user_information")
        .select("id")
        .eq("user_account", formData.id)
        .single();

      if (existingInfo) {
        // Actualizar
        const { error: infoError } = await supabaseClient
          .from("user_information")
          .update({
            whatsapp: formData.whatsapp || null,
            home_phone: formData.home_phone || null,
            office_phone: formData.office_phone || null,
            address: formData.address || null,
            city: formData.city || null,
            state: formData.state || null,
            zip_code: formData.zip_code || null,
          })
          .eq("user_account", formData.id);

        if (infoError) throw infoError;
      } else {
        // Crear
        const { error: infoError } = await supabaseClient
          .from("user_information")
          .insert({
            user_account: formData.id,
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
      console.error("Error updating client:", error);
      alert("Error al actualizar el cliente: " + (error.message || "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <AppLayout title="Cargando..." description="">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="Editar Cliente" 
      description="Modifica la información del cliente"
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
              {isLoading ? "Guardando..." : "Actualizar Cliente"}
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

