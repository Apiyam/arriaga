import { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
  {
    name: "proceedings",
    list: "/expedientes",
    create: "/expedientes/create",
    edit: "/expedientes/edit/:id",
    show: "/expedientes/show/:id",
    meta: {
      label: "Expedientes",
    },
  },
  {
    name: "audits",
    list: "/auditorias",
    create: "/auditorias/create",
    edit: "/auditorias/edit/:id",
    show: "/auditorias/show/:id",
    meta: {
      label: "Auditorías",
    },
  },
  {
    name: "binnacles",
    list: "/bitacoras",
    create: "/bitacoras/create",
    edit: "/bitacoras/edit/:id",
    show: "/bitacoras/show/:id",
    meta: {
      label: "Bitácoras",
    },
  },
  {
    name: "history_proceedings",
    list: "/historial-expedientes",
    show: "/historial-expedientes/show/:id",
    meta: {
      label: "Historial de Expedientes",
    },
  },
  {
    name: "spendings",
    list: "/gastos",
    create: "/gastos/create",
    edit: "/gastos/edit/:id",
    show: "/gastos/show/:id",
    meta: {
      label: "Gastos",
    },
  },
  {
    name: "meeting_catalogs",
    list: "/catalogos/juntas",
    create: "/catalogos/juntas/create",
    edit: "/catalogos/juntas/edit/:id",
    meta: {
      label: "Catálogo de Juntas",
    },
  },
  {
    name: "exhort_catalogs",
    list: "/catalogos/exhortos",
    create: "/catalogos/exhortos/create",
    edit: "/catalogos/exhortos/edit/:id",
    meta: {
      label: "Catálogo de Exhortos",
    },
  },
  {
    name: "process_state_catalogs",
    list: "/catalogos/estados-procesales",
    create: "/catalogos/estados-procesales/create",
    edit: "/catalogos/estados-procesales/edit/:id",
    meta: {
      label: "Catálogo de Estados Procesales",
    },
  },
  {
    name: "lic_catalogs",
    list: "/catalogos/licenciados",
    create: "/catalogos/licenciados/create",
    edit: "/catalogos/licenciados/edit/:id",
    meta: {
      label: "Catálogo de Licenciados",
    },
  },
  {
    name: "user_accounts",
    list: "/usuarios",
    create: "/usuarios/create",
    edit: "/usuarios/edit/:id",
    show: "/usuarios/show/:id",
    meta: {
      label: "Usuarios",
    },
  },
  {
    name: "user_roles",
    list: "/roles",
    meta: {
      label: "Roles de Usuario",
    },
  },
  {
    name: "clients",
    list: "/clientes",
    create: "/clientes/create",
    edit: "/clientes/edit/:id",
    show: "/clientes/show/:id",
    meta: {
      label: "Clientes",
    },
  },
];

