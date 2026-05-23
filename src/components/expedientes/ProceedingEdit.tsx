import { useForm } from "@refinedev/react-hook-form";
import { useNavigation } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useList } from "@refinedev/core";
import { useParams } from "react-router";
import { Proceeding } from "@/types/entities";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useState, useEffect } from "react";

export const ProceedingEdit = () => {
  const { id } = useParams();
  const { list } = useNavigation();
  const [description, setDescription] = useState<string>("");
  const {
    refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Proceeding>({
    refineCoreProps: {
      resource: "proceedings",
      id: id,
      action: "edit",
      redirect: "list",
    },
  });

  const currentDescription = watch("description");

  useEffect(() => {
    if (currentDescription) {
      setDescription(currentDescription);
    }
  }, [currentDescription]);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setValue("description", value);
  };

  const { data: meetingsData } = useList({
    resource: "meeting_catalogs",
    pagination: { mode: "off" },
  });

  const { data: exhortsData } = useList({
    resource: "exhort_catalogs",
    pagination: { mode: "off" },
  });

  const { data: processStatesData } = useList({
    resource: "process_state_catalogs",
    pagination: { mode: "off" },
  });

  const { data: licsData } = useList({
    resource: "lic_catalogs",
    pagination: { mode: "off" },
  });

  // Obtener valores actuales del formulario para los selects
  const meetingValue = watch("meeting_catalog");
  const exhortValue = watch("exhort_catalog");
  const processStateValue = watch("process_state_catalog");
  const licValue = watch("lic_catalog");

  return (
    <AppLayout 
      title="Editar Expediente" 
      description="Modifica la información del expediente"
    >
      <form onSubmit={handleSubmit(onFinish)}>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full_name">Nombre del Expediente *</Label>
              <Input
                id="full_name"
                {...register("full_name", { required: true })}
                className="mt-1"
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="id_proceeding">ID del Expediente</Label>
              <Input
                id="id_proceeding"
                {...register("id_proceeding")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="actor">Actor *</Label>
              <Input
                id="actor"
                {...register("actor", { required: true })}
                className="mt-1"
              />
              {errors.actor && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
              )}
            </div>

            <div>
              <Label htmlFor="defendant">Demandado</Label>
              <Input
                id="defendant"
                {...register("defendant")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date_start">Fecha de Inicio</Label>
              <Input
                id="date_start"
                type="date"
                {...register("date_start")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date_end">Fecha de Fin</Label>
              <Input
                id="date_end"
                type="date"
                {...register("date_end")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="meeting_catalog">Junta</Label>
              <select
                id="meeting_catalog"
                {...register("meeting_catalog")}
                value={meetingValue || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Seleccionar...</option>
                {meetingsData?.data?.map((meeting: any) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.catalog_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="exhort_catalog">Exhorto</Label>
              <select
                id="exhort_catalog"
                {...register("exhort_catalog")}
                value={exhortValue || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Seleccionar...</option>
                {exhortsData?.data?.map((exhort: any) => (
                  <option key={exhort.id} value={exhort.id}>
                    {exhort.catalog_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="process_state_catalog">Estado Procesal</Label>
              <select
                id="process_state_catalog"
                {...register("process_state_catalog")}
                value={processStateValue || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Seleccionar...</option>
                {processStatesData?.data?.map((state: any) => (
                  <option key={state.id} value={state.id}>
                    {state.catalog_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="lic_catalog">Licenciado</Label>
              <select
                id="lic_catalog"
                {...register("lic_catalog")}
                value={licValue || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
              >
                <option value="">Seleccionar...</option>
                {licsData?.data?.map((lic: any) => (
                  <option key={lic.id} value={lic.id}>
                    {lic.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="aod">AOD</Label>
              <Input
                id="aod"
                {...register("aod")}
                className="mt-1"
                maxLength={1}
              />
            </div>

            <div>
              <Label htmlFor="amparo">Amparo</Label>
              <Input
                id="amparo"
                {...register("amparo")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="liga">Liga</Label>
              <Input
                id="liga"
                {...register("liga")}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <div className="mt-1">
              <RichTextEditor
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Escribe la descripción del expediente..."
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
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Guardando..." : "Actualizar Expediente"}
            </Button>
          </div>
        </Card>
      </form>
    </AppLayout>
  );
};

