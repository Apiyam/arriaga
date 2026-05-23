import { useNavigation } from "@refinedev/core";
import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/utility";
import { Proceeding } from "@/types/entities";

interface VisitSheetData {
  A1?: string; A2?: string; A3?: string; A4?: string; A5?: string;
  A6?: string; A7?: string; A8?: string; A9?: string; A10?: string;
  A11?: string; A12?: string; A13?: string; A14?: string; A15?: string;
  A16?: string; A17?: string; A18?: string; A19?: string; A20?: string;
  A21?: string; A22?: string; A23?: string; A24?: string; A25?: string;
  A26?: string; A27?: string; A28?: string; A29?: string; A30?: string;
  A31?: string; A32?: string; A33?: string; A34?: string; A35?: string;
  A36?: string; A37?: string; A38?: string; A39?: string; A40?: string;
  A41?: string; A42?: string; A43?: string; A44?: string; A45?: string;
  A46?: string; A47?: string; A48?: string; A49?: string; A50?: string;
  A51?: string; A52?: string; A53?: string; A54?: string; A55?: string;
  A56?: string; A57?: string; A58?: string; A59?: string; A60?: string;
  A61?: string; A62?: string; A63?: string; A64?: string; A65?: string;
}

export const VisitSheet = () => {
  const { id } = useParams();
  const { list } = useNavigation();
  const [proceeding, setProceeding] = useState<Proceeding | null>(null);
  const [client, setClient] = useState<any>(null);
  const [visitSheet, setVisitSheet] = useState<VisitSheetData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        // Cargar expediente
        const { data: procData, error: procError } = await supabaseClient
          .from("proceedings")
          .select("*")
          .eq("id", id)
          .single();

        if (procError) throw procError;
        setProceeding(procData);

        // Cargar datos de la hoja de visita
        if (procData.visit_sheet) {
          try {
            const parsed = typeof procData.visit_sheet === 'string' 
              ? JSON.parse(procData.visit_sheet) 
              : procData.visit_sheet;
            setVisitSheet(parsed || {});
          } catch (e) {
            console.error("Error parsing visit sheet:", e);
          }
        }

        // Cargar cliente si existe
        if (procData.client_actor) {
          const { data: clientData } = await supabaseClient
            .from("user_accounts")
            .select("*")
            .eq("id", procData.client_actor)
            .single();
          setClient(clientData);
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleFieldChange = (field: string, value: string) => {
    setVisitSheet(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setVisitSheet(prev => {
      const current = prev[field as keyof VisitSheetData];
      if (checked) {
        // Si el campo puede tener múltiples valores, concatenar
        if (field === "A19") {
          const currentArray = current ? (typeof current === 'string' ? current.split(', ') : [current]) : [];
          if (!currentArray.includes(value)) {
            return { ...prev, [field]: [...currentArray, value].join(', ') };
          }
        }
        return { ...prev, [field]: value };
      } else {
        // Para checkboxes múltiples, remover el valor
        if (field === "A19" && current) {
          const currentArray = typeof current === 'string' ? current.split(', ') : [current];
          const filtered = currentArray.filter(v => v !== value);
          return { ...prev, [field]: filtered.join(', ') || "" };
        }
        return { ...prev, [field]: current === value ? "" : current };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    try {
      const { error } = await supabaseClient
        .from("proceedings")
        .update({
          visit_sheet: JSON.stringify(visitSheet),
        })
        .eq("id", id);

      if (error) throw error;

      alert("Hoja de visita guardada correctamente");
      list("proceedings");
    } catch (error: any) {
      console.error("Error saving visit sheet:", error);
      alert("Error al guardar la hoja de visita: " + (error.message || "Error desconocido"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
      title={`Hoja de visita${client ? ` - ${client.first_name} ${client.last_name}` : ""}`} 
      description="Formulario de hoja de visita del cliente"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => list("proceedings")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar a expediente
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = `/expedientes/hoja-visita/${id}/print`}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Vista Imprimible
              </Button>
              <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isSaving ? "Guardando..." : "Guardar información"}
              </Button>
            </div>
          </div>

          <Card className="p-6">
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Condiciones de trabajo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="A1">Fecha de ingreso</Label>
                <Input
                  id="A1"
                  value={visitSheet.A1 || ""}
                  onChange={(e) => handleFieldChange("A1", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A2">Puesto</Label>
                <Input
                  id="A2"
                  value={visitSheet.A2 || ""}
                  onChange={(e) => handleFieldChange("A2", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="A3">Descripción de actividades</Label>
                <Input
                  id="A3"
                  value={visitSheet.A3 || ""}
                  onChange={(e) => handleFieldChange("A3", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A4">Horario (indicar de qué día a qué día y el de comida)</Label>
                <Input
                  id="A4"
                  value={visitSheet.A4 || ""}
                  onChange={(e) => handleFieldChange("A4", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A5">Salario contratado o prometido (indicar si es semanal, decenal, catorcenal, mensual)</Label>
                <Input
                  id="A5"
                  value={visitSheet.A5 || ""}
                  onChange={(e) => handleFieldChange("A5", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A6">Si es por comisión o por viaje indicar % prometido y pago o promedio mensual obtenido</Label>
                <Input
                  id="A6"
                  value={visitSheet.A6 || ""}
                  onChange={(e) => handleFieldChange("A6", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A7">Otras prestaciones otorgadas tales como bonificación, despensa, ayudas, pasajes, comidas, comisiones, premios, etc. (especificar nombre, monto y forma de pagar)</Label>
                <Input
                  id="A7"
                  value={visitSheet.A7 || ""}
                  onChange={(e) => handleFieldChange("A7", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A8">Montos de vacaciones, prima vacacional, y aguinaldo que se acostumbra pagar</Label>
                <Input
                  id="A8"
                  value={visitSheet.A8 || ""}
                  onChange={(e) => handleFieldChange("A8", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Existe contrato colectivo de trabajo</Label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A9"
                      value="Sí"
                      checked={visitSheet.A9 === "Sí"}
                      onChange={(e) => handleFieldChange("A9", e.target.value)}
                    />
                    Sí
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A9"
                      value="No"
                      checked={visitSheet.A9 === "No"}
                      onChange={(e) => handleFieldChange("A9", e.target.value)}
                    />
                    No
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A9"
                      value="No sabe"
                      checked={visitSheet.A9 === "No sabe"}
                      onChange={(e) => handleFieldChange("A9", e.target.value)}
                    />
                    No sabe
                  </label>
                </div>
                <div className="mt-2">
                  <Label htmlFor="A10">Comentarios</Label>
                  <Input
                    id="A10"
                    value={visitSheet.A10 || ""}
                    onChange={(e) => handleFieldChange("A10", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="A11">Días del pago de salario</Label>
                <Input
                  id="A11"
                  value={visitSheet.A11 || ""}
                  onChange={(e) => handleFieldChange("A11", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Forma de pago</Label>
                <div className="mt-2 flex gap-4">
                  {["Efectivo", "Cheque", "Depósito"].map((option) => {
                    const currentValue = visitSheet.A12 || "";
                    const isChecked = currentValue.includes(option);
                    return (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange("A12", option, e.target.checked)}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="A13">Datos del banco y cuenta de pago que tenga el patrón</Label>
                <Input
                  id="A13"
                  value={visitSheet.A13 || ""}
                  onChange={(e) => handleFieldChange("A13", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A14">Documentos que se firmaban al momento del pago de salario y prestaciones</Label>
                <Input
                  id="A14"
                  value={visitSheet.A14 || ""}
                  onChange={(e) => handleFieldChange("A14", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A15">Fecha en que se firmaron por última vez estos y cualquier otro</Label>
                <Input
                  id="A15"
                  value={visitSheet.A15 || ""}
                  onChange={(e) => handleFieldChange("A15", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A16">Si firmaba libreta, cuaderno o tarjeta de asistencia fecha de la última firmada y especificar si era semanal, decenal, mensual</Label>
                <Input
                  id="A16"
                  value={visitSheet.A16 || ""}
                  onChange={(e) => handleFieldChange("A16", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A17">Indicar si se firmaba al inicio, en medio o al final del período y si se firmaba y/o registraba (especificar) a la salida y entrada de comida</Label>
                <Input
                  id="A17"
                  value={visitSheet.A17 || ""}
                  onChange={(e) => handleFieldChange("A17", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A18">Indicar los días de los espacios en blanco firmados sin checar</Label>
                <Input
                  id="A18"
                  value={visitSheet.A18 || ""}
                  onChange={(e) => handleFieldChange("A18", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Documentos firmados</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Hoja en blanco", "Recibos salariales", "Nóminas", "Listas de raya", "Contratos de trabajo", "En blanco o llenos", "Pólizas de cheque", "Otros"].map((option) => {
                    const currentValue = visitSheet.A19 || "";
                    const isChecked = currentValue.includes(option);
                    return (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange("A19", option, e.target.checked)}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <Label htmlFor="A20">Especificar</Label>
                  <Input
                    id="A20"
                    value={visitSheet.A20 || ""}
                    onChange={(e) => handleFieldChange("A20", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="A21">Fechas en las que se firmaron por última vez</Label>
                <Input
                  id="A21"
                  value={visitSheet.A21 || ""}
                  onChange={(e) => handleFieldChange("A21", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A22">Comentarios</Label>
                <Input
                  id="A22"
                  value={visitSheet.A22 || ""}
                  onChange={(e) => handleFieldChange("A22", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Renuncia</Label>
                <div className="mt-2 flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={visitSheet.A23 === "Renuncia"}
                      onChange={(e) => handleCheckboxChange("A23", "Renuncia", e.target.checked)}
                    />
                    Renuncia
                  </label>
                  <div className="flex-1">
                    <Label htmlFor="A24">Fecha de la misma</Label>
                    <Input
                      id="A24"
                      value={visitSheet.A24 || ""}
                      onChange={(e) => handleFieldChange("A24", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A25"
                      value="En blanco"
                      checked={visitSheet.A25 === "En blanco"}
                      onChange={(e) => handleFieldChange("A25", e.target.value)}
                    />
                    En blanco
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A25"
                      value="Llena"
                      checked={visitSheet.A25 === "Llena"}
                      onChange={(e) => handleFieldChange("A25", e.target.value)}
                    />
                    Llena
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A25"
                      value="No sabe"
                      checked={visitSheet.A25 === "No sabe"}
                      onChange={(e) => handleFieldChange("A25", e.target.value)}
                    />
                    No sabe
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="A26">Otros documentos importantes firmados tales como pagarés, finiquitos, etc.</Label>
                <Input
                  id="A26"
                  value={visitSheet.A26 || ""}
                  onChange={(e) => handleFieldChange("A26", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Estuvo inscrito al IMSS</Label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A27"
                      value="Sí"
                      checked={visitSheet.A27 === "Sí"}
                      onChange={(e) => handleFieldChange("A27", e.target.value)}
                    />
                    Sí
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A27"
                      value="No"
                      checked={visitSheet.A27 === "No"}
                      onChange={(e) => handleFieldChange("A27", e.target.value)}
                    />
                    No
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A27"
                      value="No sabe"
                      checked={visitSheet.A27 === "No sabe"}
                      onChange={(e) => handleFieldChange("A27", e.target.value)}
                    />
                    No sabe
                  </label>
                </div>
                <div className="mt-2">
                  <Label htmlFor="A28">Comentarios</Label>
                  <Input
                    id="A28"
                    value={visitSheet.A28 || ""}
                    onChange={(e) => handleFieldChange("A28", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="mt-2">
                  <Label>Desde el</Label>
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="A29"
                        value="Principio"
                        checked={visitSheet.A29 === "Principio"}
                        onChange={(e) => handleFieldChange("A29", e.target.value)}
                      />
                      Principio
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="A29"
                        value="Otra fecha"
                        checked={visitSheet.A29 === "Otra fecha"}
                        onChange={(e) => handleFieldChange("A29", e.target.value)}
                      />
                      Otra fecha
                    </label>
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="A30">Fecha</Label>
                    <Input
                      id="A30"
                      value={visitSheet.A30 || ""}
                      onChange={(e) => handleFieldChange("A30", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Adeudos del patrón al trabajador */}
          <Card className="p-6">
            <h4 className="text-xl font-semibold mb-4">Adeudos del patrón al trabajador</h4>
            <p className="text-sm text-gray-600 mb-4">(Indicar montos y períodos)</p>
            <div className="space-y-4">
              <div>
                <Label>Salarios devengados</Label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A31"
                      value="Sí"
                      checked={visitSheet.A31 === "Sí"}
                      onChange={(e) => handleFieldChange("A31", e.target.value)}
                    />
                    Sí
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="A31"
                      value="No"
                      checked={visitSheet.A31 === "No"}
                      onChange={(e) => handleFieldChange("A31", e.target.value)}
                    />
                    No
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="A32">Precisar días</Label>
                <Input
                  id="A32"
                  value={visitSheet.A32 || ""}
                  onChange={(e) => handleFieldChange("A32", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="A33">Vacaciones</Label>
                  <Input
                    id="A33"
                    value={visitSheet.A33 || ""}
                    onChange={(e) => handleFieldChange("A33", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A34">Prima vacacional</Label>
                  <Input
                    id="A34"
                    value={visitSheet.A34 || ""}
                    onChange={(e) => handleFieldChange("A34", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A35">Horas extra</Label>
                  <Input
                    id="A35"
                    value={visitSheet.A35 || ""}
                    onChange={(e) => handleFieldChange("A35", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A36">Séptimos días</Label>
                  <Input
                    id="A36"
                    value={visitSheet.A36 || ""}
                    onChange={(e) => handleFieldChange("A36", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A37">Aguinaldo</Label>
                  <Input
                    id="A37"
                    value={visitSheet.A37 || ""}
                    onChange={(e) => handleFieldChange("A37", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="A38">Fondos y/o cajas de ahorro</Label>
                <Input
                  id="A38"
                  value={visitSheet.A38 || ""}
                  onChange={(e) => handleFieldChange("A38", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A39">Otras</Label>
                <Input
                  id="A39"
                  value={visitSheet.A39 || ""}
                  onChange={(e) => handleFieldChange("A39", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* De la separación del trabajador */}
          <Card className="p-6">
            <h4 className="text-xl font-semibold mb-4">De la separación del trabajador</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="A40">Causa (despido, recisión, incapacidad, etc.)</Label>
                <Input
                  id="A40"
                  value={visitSheet.A40 || ""}
                  onChange={(e) => handleFieldChange("A40", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="A41">Fecha de la separación</Label>
                  <Input
                    id="A41"
                    value={visitSheet.A41 || ""}
                    onChange={(e) => handleFieldChange("A41", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A42">Hora</Label>
                  <Input
                    id="A42"
                    value={visitSheet.A42 || ""}
                    onChange={(e) => handleFieldChange("A42", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A43">Lugar de la separación</Label>
                  <Input
                    id="A43"
                    value={visitSheet.A43 || ""}
                    onChange={(e) => handleFieldChange("A43", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A44">Persona que comunicó separación</Label>
                  <Input
                    id="A44"
                    value={visitSheet.A44 || ""}
                    onChange={(e) => handleFieldChange("A44", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="A45">Puesto</Label>
                  <Input
                    id="A45"
                    value={visitSheet.A45 || ""}
                    onChange={(e) => handleFieldChange("A45", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="A46">Motivo de la separación (que le imputan al trabajador)</Label>
                <Input
                  id="A46"
                  value={visitSheet.A46 || ""}
                  onChange={(e) => handleFieldChange("A46", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A47">Que le dijeron al separarlo</Label>
                <Input
                  id="A47"
                  value={visitSheet.A47 || ""}
                  onChange={(e) => handleFieldChange("A47", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A48">Si le ofrecieron liquidación, monto de esta</Label>
                <Input
                  id="A48"
                  value={visitSheet.A48 || ""}
                  onChange={(e) => handleFieldChange("A48", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A49">Manifestar si la recibió o no y por qué</Label>
                <Input
                  id="A49"
                  value={visitSheet.A49 || ""}
                  onChange={(e) => handleFieldChange("A49", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Adeudos del trabajador al patrón */}
          <Card className="p-6">
            <h4 className="text-xl font-semibold mb-4">Adeudos del trabajador al patrón</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="A50">Concepto y monto</Label>
                <Input
                  id="A50"
                  value={visitSheet.A50 || ""}
                  onChange={(e) => handleFieldChange("A50", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="A51">Documentos firmados por el adeudo</Label>
                <Input
                  id="A51"
                  value={visitSheet.A51 || ""}
                  onChange={(e) => handleFieldChange("A51", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Observaciones */}
          <Card className="p-6">
            <h4 className="text-xl font-semibold mb-4">Observaciones</h4>
            <div>
              <Label htmlFor="A52">Información adicional</Label>
              <Input
                id="A52"
                value={visitSheet.A52 || ""}
                onChange={(e) => handleFieldChange("A52", e.target.value)}
                className="mt-1"
              />
            </div>
          </Card>

          {/* Tres testigos */}
          <Card className="p-6">
            <h4 className="text-xl font-semibold mb-4">Tres testigos</h4>
            <div className="space-y-6">
              {/* Testigo 1 */}
              <div>
                <h5 className="font-medium mb-3">Testigo 1</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="A53">Nombre propio</Label>
                    <Input
                      id="A53"
                      value={visitSheet.A53 || ""}
                      onChange={(e) => handleFieldChange("A53", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A54">Apellido paterno</Label>
                    <Input
                      id="A54"
                      value={visitSheet.A54 || ""}
                      onChange={(e) => handleFieldChange("A54", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A55">Apellido materno</Label>
                    <Input
                      id="A55"
                      value={visitSheet.A55 || ""}
                      onChange={(e) => handleFieldChange("A55", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A56">Domicilio</Label>
                    <Input
                      id="A56"
                      value={visitSheet.A56 || ""}
                      onChange={(e) => handleFieldChange("A56", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Testigo 2 */}
              <div>
                <h5 className="font-medium mb-3">Testigo 2</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="A57">Nombre propio</Label>
                    <Input
                      id="A57"
                      value={visitSheet.A57 || ""}
                      onChange={(e) => handleFieldChange("A57", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A58">Apellido paterno</Label>
                    <Input
                      id="A58"
                      value={visitSheet.A58 || ""}
                      onChange={(e) => handleFieldChange("A58", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A59">Apellido materno</Label>
                    <Input
                      id="A59"
                      value={visitSheet.A59 || ""}
                      onChange={(e) => handleFieldChange("A59", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A60">Domicilio</Label>
                    <Input
                      id="A60"
                      value={visitSheet.A60 || ""}
                      onChange={(e) => handleFieldChange("A60", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Testigo 3 */}
              <div>
                <h5 className="font-medium mb-3">Testigo 3</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="A61">Nombre propio</Label>
                    <Input
                      id="A61"
                      value={visitSheet.A61 || ""}
                      onChange={(e) => handleFieldChange("A61", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A62">Apellido paterno</Label>
                    <Input
                      id="A62"
                      value={visitSheet.A62 || ""}
                      onChange={(e) => handleFieldChange("A62", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A63">Apellido materno</Label>
                    <Input
                      id="A63"
                      value={visitSheet.A63 || ""}
                      onChange={(e) => handleFieldChange("A63", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="A64">Domicilio</Label>
                    <Input
                      id="A64"
                      value={visitSheet.A64 || ""}
                      onChange={(e) => handleFieldChange("A64", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Observaciones del abogado */}
          <Card className="p-6">
            <h4 className="text-xl font-semibold mb-4">Observaciones del abogado</h4>
            <div>
              <Label htmlFor="A65">Observaciones del abogado respecto del asunto o del cliente</Label>
              <Input
                id="A65"
                value={visitSheet.A65 || ""}
                onChange={(e) => handleFieldChange("A65", e.target.value)}
                className="mt-1"
              />
            </div>
          </Card>

          <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={isSaving} className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              {isSaving ? "Guardando..." : "Guardar información"}
            </Button>
          </div>
        </div>
      </form>
    </AppLayout>
  );
};

