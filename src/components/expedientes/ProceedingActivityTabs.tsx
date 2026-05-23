import { useInvalidate } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BinnacleFormModal } from "@/components/bitacoras/BinnacleFormModal";
import { AuditFormModal } from "@/components/auditorias/AuditFormModal";
import { SpendingFormModal } from "@/components/gastos/SpendingFormModal";
import { formatDateTimeEs } from "@/lib/datetime";
import { RICH_HTML_CONTENT_CLASS } from "@/lib/richText";
import { cn } from "@/lib/utils";
import { Audit, Binnacle, Spending } from "@/types/entities";
import { Activity, ClipboardList, DollarSign, Edit, Plus, Scale } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type TabId = "binnacles" | "spendings" | "audits";

type ProceedingActivityTabsProps = {
  proceedingId: number;
  proceedingName?: string;
  binnacles: Binnacle[];
  spendings: Spending[];
  audits: Audit[];
};

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function ProceedingActivityTabs({
  proceedingId,
  proceedingName,
  binnacles,
  spendings,
  audits,
}: ProceedingActivityTabsProps) {
  const invalidate = useInvalidate();
  const [tab, setTab] = useState<TabId>("binnacles");
  const [selectedBinnacleId, setSelectedBinnacleId] = useState<number | null>(null);
  const [selectedSpendingId, setSelectedSpendingId] = useState<number | null>(null);
  const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);

  const [binnacleModal, setBinnacleModal] = useState<Binnacle | null | "new">(null);
  const [spendingModal, setSpendingModal] = useState<Spending | null | "new">(null);
  const [auditModal, setAuditModal] = useState<Audit | null | "new">(null);

  const refresh = () => {
    invalidate({ resource: "binnacles", invalidates: ["list"] });
    invalidate({ resource: "spendings", invalidates: ["list"] });
    invalidate({ resource: "audits", invalidates: ["list"] });
  };

  const tabs = useMemo(
    () => [
      { id: "binnacles" as const, label: "Bitácoras", count: binnacles.length, icon: Activity, accent: "border-blue-500 text-blue-700" },
      { id: "spendings" as const, label: "Gastos", count: spendings.length, icon: DollarSign, accent: "border-green-600 text-green-700" },
      { id: "audits" as const, label: "Auditorías", count: audits.length, icon: Scale, accent: "border-purple-600 text-purple-700" },
    ],
    [binnacles.length, spendings.length, audits.length]
  );

  const spendingsTotal = spendings.reduce((s, x) => s + (x.total || 0), 0);

  const selectedBinnacle = binnacles.find((b) => b.id === selectedBinnacleId) ?? null;
  const selectedSpending = spendings.find((s) => s.id === selectedSpendingId) ?? null;
  const selectedAudit = audits.find((a) => a.id === selectedAuditId) ?? null;

  useEffect(() => {
    if (tab === "binnacles") {
      setSelectedBinnacleId((prev) => (binnacles.some((b) => b.id === prev) ? prev : binnacles[0]?.id ?? null));
    }
    if (tab === "spendings") {
      setSelectedSpendingId((prev) => (spendings.some((s) => s.id === prev) ? prev : spendings[0]?.id ?? null));
    }
    if (tab === "audits") {
      setSelectedAuditId((prev) => (audits.some((a) => a.id === prev) ? prev : audits[0]?.id ?? null));
    }
  }, [tab, binnacles, spendings, audits]);

  const openAdd = () => {
    if (tab === "binnacles") setBinnacleModal("new");
    if (tab === "spendings") setSpendingModal("new");
    if (tab === "audits") setAuditModal("new");
  };

  const ListEmpty = ({ message }: { message: string }) => (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
      <ClipboardList className="h-10 w-10 opacity-30 mb-2" />
      <p className="text-sm">{message}</p>
      <Button type="button" size="sm" className="mt-4 gap-1" onClick={openAdd}>
        <Plus className="h-4 w-4" />
        Añadir
      </Button>
    </div>
  );

  return (
    <Card className="flex flex-col min-h-[400px] max-h-[min(720px,calc(100vh-13rem))] overflow-hidden border-gray-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-gray-50/80 px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors border-b-2",
                  active ? `${t.accent} bg-white shadow-sm border-b-current` : "border-transparent text-gray-600 hover:bg-white/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    active ? "bg-white/80" : "bg-gray-200 text-gray-700"
                  )}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
        <Button type="button" size="sm" className="gap-1 shrink-0" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Añadir
        </Button>
      </div>

      {tab === "spendings" && spendings.length > 0 && (
        <div className="border-b bg-green-50/60 px-4 py-2 text-sm text-green-900">
          Total del expediente:{" "}
          <strong>
            ${spendingsTotal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>
      )}

      <div className="flex flex-1 min-h-0 flex-col md:flex-row overflow-hidden">
        {/* Lista — scroll propio sin desplazar toda la página */}
        <div className="flex flex-col min-h-0 shrink-0 max-h-[38vh] md:max-h-full md:w-[38%] lg:w-[34%] border-b md:border-b-0 md:border-r overflow-hidden">
          {tab === "binnacles" && (
            <>
              {binnacles.length === 0 ? (
                <ListEmpty message="Sin bitácoras en este expediente." />
              ) : (
                <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y">
                  {binnacles.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedBinnacleId(b.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 transition-colors hover:bg-blue-50/80",
                          selectedBinnacleId === b.id && "bg-blue-50 border-l-4 border-l-blue-500"
                        )}
                      >
                        <p className="text-xs text-muted-foreground">{formatDateTimeEs(b.date_time_binnacle)}</p>
                        <p className="text-sm font-medium line-clamp-2 mt-0.5">
                          {stripHtml(b.activity) || "Sin descripción"}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {tab === "spendings" && (
            <>
              {spendings.length === 0 ? (
                <ListEmpty message="Sin gastos registrados." />
              ) : (
                <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y">
                  {spendings.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedSpendingId(s.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 transition-colors hover:bg-green-50/80",
                          selectedSpendingId === s.id && "bg-green-50 border-l-4 border-l-green-600"
                        )}
                      >
                        <div className="flex justify-between gap-2 items-start">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{formatDateTimeEs(s.date_time_spending)}</p>
                            <p className="text-sm font-medium truncate">{s.concept || "Sin concepto"}</p>
                            {s.type && <p className="text-xs text-muted-foreground">{s.type}</p>}
                          </div>
                          <p className="text-sm font-bold text-green-700 shrink-0">
                            ${(s.total ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {tab === "audits" && (
            <>
              {audits.length === 0 ? (
                <ListEmpty message="Sin auditorías o audiencias." />
              ) : (
                <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y">
                  {audits.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedAuditId(a.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 transition-colors hover:bg-purple-50/80",
                          selectedAuditId === a.id && "bg-purple-50 border-l-4 border-l-purple-600"
                        )}
                      >
                        <p className="text-xs text-muted-foreground">{formatDateTimeEs(a.date_time_audit)}</p>
                        <p className="text-sm font-medium">{a.type_audit || "Sin tipo"}</p>
                        {a.status_audit && (
                          <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                            {a.status_audit}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Detalle — scroll independiente del panel izquierdo */}
        <div className="flex flex-1 flex-col min-h-[240px] md:min-h-0 bg-white overflow-hidden">
          {tab === "binnacles" && (
            selectedBinnacle ? (
              <DetailPanel
                date={formatDateTimeEs(selectedBinnacle.date_time_binnacle)}
                onEdit={() => setBinnacleModal(selectedBinnacle)}
              >
                <div
                  className={RICH_HTML_CONTENT_CLASS}
                  dangerouslySetInnerHTML={{ __html: selectedBinnacle.activity || "<p>Sin descripción</p>" }}
                />
              </DetailPanel>
            ) : (
              <ListEmpty message="Selecciona una bitácora o crea una nueva." />
            )
          )}

          {tab === "spendings" && (
            selectedSpending ? (
              <DetailPanel
                date={formatDateTimeEs(selectedSpending.date_time_spending)}
                onEdit={() => setSpendingModal(selectedSpending)}
              >
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Concepto</dt>
                    <dd className="font-medium text-lg">{selectedSpending.concept}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Monto</dt>
                    <dd className="font-bold text-2xl text-green-700">
                      ${(selectedSpending.total ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                  {selectedSpending.type && (
                    <div>
                      <dt className="text-muted-foreground">Tipo</dt>
                      <dd>{selectedSpending.type}</dd>
                    </div>
                  )}
                </dl>
              </DetailPanel>
            ) : (
              <ListEmpty message="Selecciona un gasto o añade uno nuevo." />
            )
          )}

          {tab === "audits" && (
            selectedAudit ? (
              <DetailPanel
                date={formatDateTimeEs(selectedAudit.date_time_audit)}
                onEdit={() => setAuditModal(selectedAudit)}
                badge={selectedAudit.status_audit}
              >
                <p className="text-sm font-semibold text-purple-800 mb-3">
                  {selectedAudit.type_audit}
                </p>
                <div
                  className={RICH_HTML_CONTENT_CLASS}
                  dangerouslySetInnerHTML={{ __html: selectedAudit.activity || "<p>Sin descripción</p>" }}
                />
              </DetailPanel>
            ) : (
              <ListEmpty message="Selecciona una auditoría o crea una nueva." />
            )
          )}
        </div>
      </div>

      <BinnacleFormModal
        open={binnacleModal !== null}
        onOpenChange={(o) => !o && setBinnacleModal(null)}
        proceedingId={proceedingId}
        proceedingName={proceedingName}
        binnacle={binnacleModal === "new" ? null : binnacleModal}
        onSaved={refresh}
      />
      <SpendingFormModal
        open={spendingModal !== null}
        onOpenChange={(o) => !o && setSpendingModal(null)}
        proceedingId={proceedingId}
        proceedingName={proceedingName}
        spending={spendingModal === "new" ? null : spendingModal}
        onSaved={refresh}
      />
      <AuditFormModal
        open={auditModal !== null}
        onOpenChange={(o) => !o && setAuditModal(null)}
        proceedingId={proceedingId}
        proceedingName={proceedingName}
        audit={auditModal === "new" ? null : auditModal}
        onSaved={refresh}
      />
    </Card>
  );
}

function DetailPanel({
  date,
  onEdit,
  badge,
  children,
}: {
  date: string;
  onEdit: () => void;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm text-muted-foreground truncate">{date}</p>
          {badge && (
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">{badge}</span>
          )}
        </div>
        <Button type="button" size="sm" variant="outline" className="gap-1 shrink-0" onClick={onEdit}>
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}
