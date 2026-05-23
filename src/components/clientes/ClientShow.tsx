import { useNavigation } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { Edit, ArrowLeft, Users, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/utility";

interface ClientData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  register_date?: string;
  whatsapp?: string;
  home_phone?: string;
  office_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export const ClientShow = () => {
  const { id } = useParams();
  const { edit } = useNavigation();
  const [client, setClient] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        const { data: infoData } = await supabaseClient
          .from("user_information")
          .select("*")
          .eq("user_account", id)
          .single();

        if (userData) {
          setClient({
            id: userData.id,
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            register_date: userData.register_date,
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
        setIsLoading(false);
      }
    };

    loadClient();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout title="Cargando..." description="">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!client) {
    return (
      <AppLayout title="Cliente no encontrado" description="">
        <Card className="p-6">
          <p>El cliente solicitado no existe.</p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={`${client.first_name} ${client.last_name}`} 
      description="Información completa del cliente"
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
            onClick={() => edit("clients", client.id)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nombre Completo</h3>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                {client.first_name} {client.last_name}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-lg">{client.email || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Registro</h3>
              <p className="text-lg">
                {client.register_date 
                  ? new Date(client.register_date).toLocaleDateString('es-ES')
                  : "-"
                }
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                WhatsApp
              </h3>
              <p className="text-lg">{client.whatsapp || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Teléfono de Casa</h3>
              <p className="text-lg">{client.home_phone || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Teléfono de Trabajo</h3>
              <p className="text-lg">{client.office_phone || "-"}</p>
            </div>

            {(client.address || client.city || client.state || client.zip_code) && (
              <>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Dirección
                  </h3>
                  <p className="text-lg">
                    {client.address && `${client.address}, `}
                    {client.city && `${client.city}, `}
                    {client.state && `${client.state} `}
                    {client.zip_code && `C.P. ${client.zip_code}`}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

