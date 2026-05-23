import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { supabaseClient } from "@/utility";
import { Proceeding } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { useNavigation } from "@refinedev/core";
import { getVisitSheetContract, DEFAULT_VISIT_SHEET_CONTRACT } from "@/lib/visitSheetContract";

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

interface ClientData {
  first_name?: string;
  last_name?: string;
  email?: string;
  whatsapp?: string;
  home_phone?: string;
  office_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export const VisitSheetPrint = () => {
  const { id } = useParams();
  const { list } = useNavigation();
  const [proceeding, setProceeding] = useState<Proceeding | null>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [visitSheet, setVisitSheet] = useState<VisitSheetData>({});
  const [contractText, setContractText] = useState(DEFAULT_VISIT_SHEET_CONTRACT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const contract = await getVisitSheetContract();
        setContractText(contract);

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
          
          if (clientData) {
            // Cargar información adicional del cliente
            const { data: clientInfo } = await supabaseClient
              .from("user_information")
              .select("*")
              .eq("user_account", procData.client_actor)
              .single();

            setClient({
              first_name: clientData.first_name,
              last_name: clientData.last_name,
              email: clientData.email,
              whatsapp: clientInfo?.whatsapp,
              home_phone: clientInfo?.home_phone,
              office_phone: clientInfo?.office_phone,
              address: clientInfo?.address,
              city: clientInfo?.city,
              state: clientInfo?.state,
              zip_code: clientInfo?.zip_code,
            });
          }
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="print-container">
      {/* Botones de acción - ocultos al imprimir */}
      <div className="no-print mb-4 p-4 bg-white shadow-sm rounded">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => list("proceedings")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido imprimible */}
      <div className="print-content bg-white p-8 max-w-4xl mx-auto">
        <style>{`
          @media print {
            .no-print {
              display: none !important;
            }
            .print-content {
              padding: 0 !important;
              max-width: 100% !important;
            }
            body {
              margin: 0;
              padding: 0;
            }
            @page {
              margin: 1cm;
            }
          }
          .print-content {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
          }
          .print-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0;
          }
          .print-content td {
            padding: 4px 8px;
            vertical-align: top;
          }
          .print-content b {
            font-weight: bold;
          }
          .print-content hr {
            border: none;
            border-top: 3px solid #000;
            margin: 10px 0;
          }
          .print-content h1, .print-content h2 {
            margin: 10px 0;
            text-align: center;
          }
          .print-content h1 {
            font-size: 18pt;
            font-weight: bold;
          }
          .print-content h2 {
            font-size: 14pt;
            font-weight: bold;
          }
          .print-content .section-title {
            font-size: 12pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 15px 0 10px 0;
          }
          .print-content .label {
            font-size: 10pt;
            font-weight: normal;
          }
          .print-content .value {
            font-weight: bold;
          }
        `}</style>

        <center>
          <h1>Arturo Arriaga y Abogados</h1>
          <h2>Hoja de Visita</h2>
          <hr />
        </center>

        <table width="100%" border={0}>
          <tr className="text-left">
            <td className="label">RECOMENDO:</td>
            <td className="value"></td>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td className="label">CORRESPONDE A:</td>
            <td className="value"></td>
          </tr>
          <tr className="text-left">
            <td className="label">SU COMISION:</td>
            <td className="value"></td>
            <td></td>
            <td className="label">TOMO DATOS:</td>
            <td className="value"></td>
          </tr>
          <tr className="text-left">
            <td className="label">COBRAR:</td>
            <td className="value"></td>
            <td></td>
            <td className="label">FECHA:</td>
            <td className="value">
              {proceeding?.date_start 
                ? new Date(proceeding.date_start).toLocaleDateString('es-ES')
                : new Date().toLocaleDateString('es-ES')
              }
            </td>
          </tr>
        </table>

        <br />
        <b>No. Interno: {proceeding?.id_proceeding || ""}</b>
        <hr />
        <br /><br />

        <div className="section-title">CONTRATO DE PRESTACION DE SERVICIOS PROFESIONALES Y DATOS PARA DEMANDA</div>
        <br />
        <p style={{ textAlign: 'justify', fontSize: '10pt' }}>
          <b>{contractText}</b>
        </p>
        <br /><br />

        <div className="section-title">DATOS</div>
        <br />
        <div className="section-title">DEL TRABAJADOR (CLIENTE)</div>
        <br />

        <table width="100%" border={0}>
          <tr className="text-left">
            <td className="label">NOMBRE PROPIO:</td>
            <td className="value">{client?.first_name || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO PATERNO:</td>
            <td className="value">{client?.last_name?.split(' ')[0] || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO MATERNO:</td>
            <td className="value">{client?.last_name?.split(' ').slice(1).join(' ') || ""}</td>
          </tr>
        </table>

        <br /><br />
        <div className="section-title">DOMICILIO DEL TRABAJADOR</div>
        <br />
        <div className="label">CALLE, AVENIDA, CALZADA, CALLEJON, CERRADA, RETORNO (precisar):</div>
        <div className="value">{client?.address || ""}</div>
        <br />

        <table width="100%" border={0}>
          <tr className="text-left">
            <td className="label">NUMERO EXTERIOR:</td>
            <td className="value"></td>
            <td className="label">NUMERO INTERIOR:</td>
            <td className="value"></td>
          </tr>
          <tr className="text-left">
            <td className="label">COLONIA:</td>
            <td className="value"></td>
            <td className="label">CODIGO POSTAL:</td>
            <td className="value">{client?.zip_code || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">DELEGACION:</td>
            <td className="value"></td>
            <td className="label">MUNICIPIO:</td>
            <td className="value"></td>
          </tr>
          <tr className="text-left">
            <td className="label">ENTIDAD:</td>
            <td className="value">{client?.state || ""}</td>
            <td className="label">TELEFONOS:</td>
            <td className="value">
              {[client?.home_phone, client?.office_phone, client?.whatsapp]
                .filter(Boolean)
                .join(', ')}
            </td>
          </tr>
        </table>

        <br />
        <div className="label">DOMICILIO Y TELEFONO DE UN FAMILIAR QUE NO VIVA CON EL</div>
        <div className="value"></div>
        <br /><br />

        <div className="section-title">DE LOS DEMANDADOS FISICOS Y/O MORALES</div>
        <br />
        <div className="label">NOMBRE DE LA(S) EMPRESA(S):</div>
        <div className="value">{proceeding?.defendant || ""}</div>
        <br />
        <div className="label">ACTIVIDAD:</div>
        <div className="value"></div>
        <br /><br />

        <div className="section-title">CONDICIONES DE TRABAJO</div>
        <br />

        <table width="100%" border={0}>
          <tr className="text-left">
            <td className="label">FECHA DE INGRESO:</td>
            <td className="value">{visitSheet.A1 || ""}</td>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td className="label">PUESTO:</td>
            <td className="value">{visitSheet.A2 || ""}</td>
          </tr>
        </table>

        <br />
        <div className="label">DESCRIPCION DE ACTIVIDADES:</div>
        <div className="value">{visitSheet.A3 || ""}</div>
        <br />
        <div className="label">HORARIO (indicar de qué día a qué día y el de comida):</div>
        <div className="value">{visitSheet.A4 || ""}</div>
        <br />
        <div className="label">SALARIO CONTRATADO O PROMETIDO (indicar si es semanal, decenal, catorcenal, mensual):</div>
        <div className="value">{visitSheet.A5 || ""}</div>
        <br />
        <div className="label">SI ES POR COMISION O POR VIAJE INDICAR % PROMETIDO Y PAGO O PROMEDIO MENSUAL OBTENIDO:</div>
        <div className="value">{visitSheet.A6 || ""}</div>
        <br />
        <div className="label">OTRAS PRESTACIONES OTORGADAS tales como bonificación, despensa, ayudas, pasajes, comidas, comisiones, premios, etc. (especificar nombre, monto y forma de pagar):</div>
        <div className="value">{visitSheet.A7 || ""}</div>
        <br />
        <div className="label">MONTOS DE VACACIONES, PRIMA VACACIONAL Y AGUINALDO QUE SE ACOSTUMBRA PAGAR:</div>
        <div className="value">{visitSheet.A8 || ""}</div>
        <br /><br />
        <div className="label">EXISTE CONTRATO COLECTIVO DE TRABAJO:</div>
        <div className="value">{visitSheet.A9 || ""}</div>
        {visitSheet.A10 && (
          <>
            <div className="label"><b>Comentarios:</b></div>
            <div className="value">{visitSheet.A10}</div>
          </>
        )}
        <br />
        <div className="label">DIAS DEL PAGO DE SALARIO:</div>
        <div className="value">{visitSheet.A11 || ""}</div>
        <br />
        <div className="label">FORMA DE PAGO DEL SALARIO:</div>
        <div className="value">{visitSheet.A12 || ""}</div>
        <br />
        <div className="label">DATOS DEL BANCO Y CUENTA DE PAGO QUE TENGA EL PATRON:</div>
        <div className="value">{visitSheet.A13 || ""}</div>
        <br />
        <div className="label">DOCUMENTOS QUE SE FIRMABAN AL MOMENTO DEL PAGO DEL SALARIO Y PRESTACIONES:</div>
        <div className="value">{visitSheet.A14 || ""}</div>
        <br />
        <div className="label">FECHA EN QUE SE FIRMARON POR ULTIMA VEZ ESTOS Y CUALQUIER OTROS:</div>
        <div className="value">{visitSheet.A15 || ""}</div>
        <br />
        <div className="label">SI FIRMABA LIBRETA, CUADERNO O TARJETA DE ASISTENCIA FECHA DE LA ULTIMA FIRMADA Y ESPECIFICAR SI ERA SEMANAL, DECENAL, MENSUAL:</div>
        <div className="value">{visitSheet.A16 || ""}</div>
        <br />
        <div className="label">INDICAR SI SE FIRMABA AL INICIO, EN MEDIO O AL FINAL DEL PERIODO Y SI SE FIRMABA Y/O REGISTRABA (ESPECIFICAR) A LA SALIDA Y ENTRADA DE COMIDA:</div>
        <div className="value">{visitSheet.A17 || ""}</div>
        <br />
        <div className="label">INDICAR LOS DIAS DE LOS ESPACIOS EN BLANCO FIRMADOS SIN CHECAR:</div>
        <div className="value">{visitSheet.A18 || ""}</div>
        <br />
        <div className="label">DOCUMENTOS FIRMADOS:</div>
        <div className="value">{visitSheet.A19 || ""}</div>
        {visitSheet.A20 && (
          <>
            <div className="label"><b>Especificar:</b></div>
            <div className="value">{visitSheet.A20}</div>
          </>
        )}
        <br />
        <div className="label">FECHAS EN LAS QUE SE FIRMARON POR ULTIMA VEZ:</div>
        <div className="value">{visitSheet.A21 || ""}</div>
        <br />
        <div className="label">COMENTARIOS:</div>
        <div className="value">{visitSheet.A22 || ""}</div>
        <br />
        <div className="label">RENUNCIA:</div>
        <div className="value">{visitSheet.A23 || ""}</div>
        {visitSheet.A24 && (
          <>
            <div className="label">Fecha de la misma:</div>
            <div className="value">{visitSheet.A24}</div>
          </>
        )}
        <div className="value">{visitSheet.A25 || ""}</div>
        <br />
        <div className="label">OTROS DOCUMENTOS IMPORTANTES FIRMADOS tales como pagarés, finiquitos, etc.:</div>
        <div className="value">{visitSheet.A26 || ""}</div>
        <br />
        <div className="label">ESTUVO INSCRITO AL IMSS:</div>
        <div className="value">{visitSheet.A27 || ""}</div>
        {visitSheet.A28 && (
          <>
            <div className="label"><b>Comentarios:</b></div>
            <div className="value">{visitSheet.A28}</div>
          </>
        )}
        <div className="label">DESDE EL:</div>
        <div className="value">{visitSheet.A29 || ""}</div>
        {visitSheet.A30 && (
          <>
            <div className="label">Fecha:</div>
            <div className="value">{visitSheet.A30}</div>
          </>
        )}

        <br /><br />
        <div className="section-title">ADEUDOS DEL PATRON AL TRABAJADOR</div>
        <div className="label">(Indicar montos y períodos)</div>
        <br />

        <div className="label">SALARIOS DEVENGADOS:</div>
        <div className="value">{visitSheet.A31 || ""}</div>
        <div className="label">Precisar días:</div>
        <div className="value">{visitSheet.A32 || ""}</div>
        <br />

        <table width="100%" border={0}>
          <tr className="text-left">
            <td className="label">VACACIONES:</td>
            <td className="value">{visitSheet.A33 || ""}</td>
            <td className="label">PRIMA VACACIONAL:</td>
            <td className="value">{visitSheet.A34 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">HORAS EXTRAS:</td>
            <td className="value">{visitSheet.A35 || ""}</td>
            <td className="label">SEPTIMOS DIAS:</td>
            <td className="value">{visitSheet.A36 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">AGUINALDO:</td>
            <td className="value">{visitSheet.A37 || ""}</td>
            <td></td>
            <td></td>
          </tr>
        </table>

        <br />
        <div className="label">FONDOS Y/O CAJAS DE AHORRO:</div>
        <div className="value">{visitSheet.A38 || ""}</div>
        <br />
        <div className="label">OTRAS:</div>
        <div className="value">{visitSheet.A39 || ""}</div>
        <br /><br />

        <div className="section-title">DE LA SEPARACION DEL TRABAJADOR</div>
        <br />
        <div className="label">CAUSA (despido, recisión, incapacidad, etc.):</div>
        <div className="value">{visitSheet.A40 || ""}</div>
        <br />

        <table width="80%" border={0}>
          <tr className="text-left">
            <td className="label">FECHA DE LA SEPARACION:</td>
            <td className="value">{visitSheet.A41 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">HORA:</td>
            <td className="value">{visitSheet.A42 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">LUGAR DE LA SEPARACION:</td>
            <td className="value">{visitSheet.A43 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">PERSONA QUE COMUNICO SEPARACION:</td>
            <td className="value">{visitSheet.A44 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">PUESTO:</td>
            <td className="value">{visitSheet.A45 || ""}</td>
          </tr>
        </table>

        <br />
        <div className="label">MOTIVO DE LA SEPARACION (que le imputan al trabajador):</div>
        <div className="value">{visitSheet.A46 || ""}</div>
        <br />
        <div className="label">QUE LE DIJERON AL SEPARARLO:</div>
        <div className="value">{visitSheet.A47 || ""}</div>
        <br />
        <div className="label">SI LE OFRECIERON LIQUIDACION, MONTO DE ESTA:</div>
        <div className="value">{visitSheet.A48 || ""}</div>
        <br />
        <div className="label">MANIFESTAR SI LA RECIBIO O NO Y POR QUE:</div>
        <div className="value">{visitSheet.A49 || ""}</div>
        <br /><br />

        <div className="section-title">ADEUDOS DEL TRABAJADOR AL PATRON</div>
        <br />
        <div className="label">CONCEPTO Y MONTO:</div>
        <div className="value">{visitSheet.A50 || ""}</div>
        <br />
        <div className="label">DOCUMENTOS FIRMADOS POR EL ADEUDO:</div>
        <div className="value">{visitSheet.A51 || ""}</div>
        <br /><br />

        <div className="section-title">OBSERVACIONES</div>
        <br />
        <div className="label">INFORMACION ADICIONAL:</div>
        <div className="value">{visitSheet.A52 || ""}</div>
        <br /><br />

        <div className="section-title">TRES TESTIGOS</div>
        <br />

        <table width="80%" border={0}>
          <tr className="text-left">
            <td className="label">NOMBRE PROPIO:</td>
            <td className="value">{visitSheet.A53 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO PATERNO:</td>
            <td className="value">{visitSheet.A54 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO MATERNO:</td>
            <td className="value">{visitSheet.A55 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">DOMICILIO:</td>
            <td className="value">{visitSheet.A56 || ""}</td>
          </tr>
        </table>

        <br /><br />

        <table width="80%" border={0}>
          <tr className="text-left">
            <td className="label">NOMBRE PROPIO:</td>
            <td className="value">{visitSheet.A57 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO PATERNO:</td>
            <td className="value">{visitSheet.A58 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO MATERNO:</td>
            <td className="value">{visitSheet.A59 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">DOMICILIO:</td>
            <td className="value">{visitSheet.A60 || ""}</td>
          </tr>
        </table>

        <br /><br />

        <table width="80%" border={0}>
          <tr className="text-left">
            <td className="label">NOMBRE PROPIO:</td>
            <td className="value">{visitSheet.A61 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO PATERNO:</td>
            <td className="value">{visitSheet.A62 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">APELLIDO MATERNO:</td>
            <td className="value">{visitSheet.A63 || ""}</td>
          </tr>
          <tr className="text-left">
            <td className="label">DOMICILIO:</td>
            <td className="value">{visitSheet.A64 || ""}</td>
          </tr>
        </table>

        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <b>FIRMA DEL TRABAJADOR</b>
        </div>
        <br />
        <div style={{ textAlign: 'center', borderTop: '1px solid #000', paddingTop: '40px', marginTop: '20px' }}>
          <b>{client?.first_name} {client?.last_name}</b>
        </div>
        <br /><br /><br />

        <div className="section-title" style={{ textAlign: 'center' }}>
          OBSERVACIONES DEL ABOGADO RESPECTO DEL ASUNTO O DEL CLIENTE:
        </div>
        <div className="value" style={{ textAlign: 'center' }}>{visitSheet.A65 || ""}</div>
      </div>
    </div>
  );
};

