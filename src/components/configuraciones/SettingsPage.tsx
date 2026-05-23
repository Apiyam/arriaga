import { AppLayout } from "../dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { exportDatabaseBackup, downloadBackupJson } from "@/lib/databaseBackup";
import {
  DEFAULT_VISIT_SHEET_CONTRACT,
  getVisitSheetContract,
  saveVisitSheetContract,
} from "@/lib/visitSheetContract";
import { cn } from "@/lib/utils";
import { Database, FileText, Loader2, RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";

type SettingsTab = "backup" | "contract";

export const SettingsPage = () => {
  const [tab, setTab] = useState<SettingsTab>("contract");
  const [contract, setContract] = useState(DEFAULT_VISIT_SHEET_CONTRACT);
  const [loadingContract, setLoadingContract] = useState(true);
  const [savingContract, setSavingContract] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingContract(true);
      try {
        const text = await getVisitSheetContract();
        if (!cancelled) setContract(text);
      } finally {
        if (!cancelled) setLoadingContract(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBackup = async () => {
    setBackingUp(true);
    setBackupProgress(null);
    try {
      const payload = await exportDatabaseBackup((table, index, total) => {
        setBackupProgress(`${table} (${index}/${total})`);
      });
      downloadBackupJson(payload);
      const rowCount = Object.values(payload.tables).reduce((n, t) => n + t.rows.length, 0);
      toast({
        title: "Respaldo descargado",
        description: `${rowCount} registros exportados en JSON.`,
      });
    } catch (e) {
      toast({
        title: "Error al generar respaldo",
        description: e instanceof Error ? e.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setBackingUp(false);
      setBackupProgress(null);
    }
  };

  const handleSaveContract = async () => {
    setSavingContract(true);
    try {
      await saveVisitSheetContract(contract);
      toast({ title: "Contrato guardado", description: "Se aplicará en todas las hojas de visita al imprimir." });
    } catch (e) {
      toast({
        title: "No se pudo guardar",
        description: e instanceof Error ? e.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setSavingContract(false);
    }
  };

  const tabs = [
    
    { id: "contract" as const, label: "Contrato hoja de visita", icon: FileText },
    { id: "backup" as const, label: "Respaldo", icon: Database },
  ];

  return (
    <AppLayout
      title="Configuraciones"
      description="Respaldo de datos y texto del contrato para impresión de hojas de visita."
    >
      <div className="flex flex-col min-h-[480px] gap-4">
        <div className="flex flex-wrap gap-1 border-b bg-gray-50/80 rounded-t-lg px-2 py-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "bg-white text-primary shadow-sm border border-gray-200"
                    : "text-gray-600 hover:bg-white/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

       

        {tab === "contract" && (
          <Card className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800">Contrato — Hoja de visita</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Este texto aparece en negrita bajo «CONTRATO DE PRESTACION DE SERVICIOS PROFESIONALES» al imprimir la
              hoja de visita de cualquier expediente.
            </p>

            {loadingContract ? (
              <div className="flex items-center gap-2 py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Cargando texto…
              </div>
            ) : (
              <>
                <div className="mt-4 flex-1 flex flex-col min-h-0">
                  <Label htmlFor="visit-contract">Texto del contrato</Label>
                  <Textarea
                    id="visit-contract"
                    value={contract}
                    onChange={(e) => setContract(e.target.value)}
                    className="mt-2 min-h-[220px] flex-1 text-sm leading-relaxed"
                    placeholder="Texto del contrato…"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={handleSaveContract}
                    disabled={savingContract}
                    className="gap-2"
                  >
                    {savingContract ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar contrato
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => setContract(DEFAULT_VISIT_SHEET_CONTRACT)}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurar texto original
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}

{tab === "backup" && (
          <Card className="p-6 flex-1">
            <h3 className="text-lg font-semibold text-gray-800">Respaldo de la base de datos</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Descarga un archivo con las tablas principales del sistema (expedientes, bitácoras, gastos,
              auditorías, usuarios, catálogos y configuración).
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button type="button" onClick={handleBackup} disabled={backingUp} className="gap-2">
                {backingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                {backingUp ? "Generando respaldo…" : "Descargar respaldo JSON"}
              </Button>
              {backupProgress && (
                <span className="text-sm text-muted-foreground">Exportando: {backupProgress}</span>
              )}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};
