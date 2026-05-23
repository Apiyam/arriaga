// Tipos TypeScript para todas las entidades de la base de datos

export interface UserRole {
  id: number;
  role_name?: string;
  roles_json?: string;
}

export interface UserAccount {
  id: number;
  user_role?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  register_date?: string;
  last_login_date?: string;
  lang?: number;
  status?: number;
  unique_token?: string;
  password?: string;
  avatar?: string;
  permissions?: string;
}

export interface UserInformation {
  id: number;
  user_account?: number;
  id_region?: number;
  associate_type?: number;
  birthday?: string;
  code_home_phone?: string;
  home_phone?: string;
  code_office_phone?: string;
  office_phone?: string;
  whatsapp?: string;
  facebook_url?: string;
  instagram_url?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  unique_token?: string;
}

export interface Proceeding {
  id: number;
  user_account?: number;
  team_catalog?: number;
  meeting_catalog?: number;
  client_actor?: number;
  exhort_catalog?: number;
  process_state_catalog?: number;
  full_name?: string;
  defendant?: string;
  description?: string;
  date_start?: string;
  date_end?: string;
  status?: number;
  visit_sheet?: string;
  id_proceeding?: string;
  actor?: string;
  aod?: string;
  amparo?: string;
  liga?: string;
  lic_catalog?: number;
  history?: string;
}

/** Metadatos de archivos en R2 por expediente */
export interface ProceedingFile {
  id: string;
  proceeding_id: number;
  storage_key: string;
  original_name: string;
  mime_type?: string | null;
  size_bytes?: number | null;
  created_at?: string;
}

export interface Audit {
  id: number;
  user_account?: number;
  proceeding?: number;
  date_time_audit?: string;
  type_audit?: string;
  status_audit?: string;
  activity?: string;
  status?: number;
  date_time_capture?: string;
}

export interface Binnacle {
  id: number;
  user_account?: number;
  proceeding?: number;
  date_time_binnacle?: string;
  activity?: string;
  status?: number;
}

export interface HistoryProceeding {
  id: number;
  user_account?: number;
  proceeding?: number;
  date_time_event?: string;
  activity?: string;
  status?: number;
  date_time_capture?: string;
}

export interface Spending {
  id: number;
  user_account?: number;
  proceeding?: number;
  date_time_spending?: string;
  concept?: string;
  total?: number;
  status?: number;
  type?: string;
}

export interface MeetingCatalog {
  id: number;
  catalog_name?: string;
  description?: string;
  status?: number;
  type_meeting?: number;
  id_meeting?: string;
}

export interface ExhortCatalog {
  id: number;
  catalog_name?: string;
  description?: string;
  status?: number;
  exhort_type?: string;
}

export interface ProcessStateCatalog {
  id: number;
  catalog_name?: string;
  description?: string;
  status?: number;
  process_type?: string;
}

export interface LicCatalog {
  id: number;
  full_name?: string;
  status?: number;
}

export interface HistoricalData {
  id: number;
  proceeding?: number;
  user_account?: number;
  type?: number;
  information?: string;
}

export interface Category {
  id: number;
  category_name?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  status?: number;
}

export interface Line {
  id: number;
  line_name?: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  status?: number;
}

export interface Product {
  id: number;
  line?: number;
  category?: number;
  sku?: string;
  product_name?: string;
  short_description?: string;
  long_description?: string;
  form_to_use?: string;
  is_seasonal?: number;
  is_commissionable?: number;
  lifetime?: number;
  qty?: number;
  minimum_stock?: number;
  weight?: number;
  width?: number;
  depth?: number;
  height?: number;
  cost?: number;
  public_price?: number;
  max_discount?: number;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  status?: number;
}

export interface AssociateCategory {
  id: number;
  category_name?: string;
  extra_data?: string;
  status?: number;
}

export interface AssociatePlatform {
  id: number;
  id_associate?: number;
  id_parent_platform?: number;
  platform_level?: number;
  creation_date?: string;
  delete_date?: string;
  status?: number;
}

export interface AssociateType {
  id: number;
  id_associate?: number;
  id_associate_category?: number;
  entry_date?: string;
  exit_date?: string;
  status?: number;
}

export interface OrderAssociate {
  id: number;
  id_associate?: number;
  order_date?: string;
  total_to_pay?: number;
  gain_discount?: number;
  total_with_discount?: number;
  tracking_id?: string;
  status?: number;
}

export interface OrderAssociateDetails {
  id: number;
  order_associate?: number;
  product?: number;
  qty?: number;
  discount_rule?: number;
  subtotal?: number;
  status?: number;
}

export interface PaymentPreferenceAssociate {
  id: number;
  associate?: number;
  paypal_email?: string;
  skrill_account?: string;
  skrill_phone?: string;
  skrill_email?: string;
  transfer_clabe?: string;
  transfer_card?: string;
  transfer_full_name?: string;
  bank_account_number?: string;
  bank_full_name?: string;
  bank_name?: string;
  bank_swift?: string;
}

export interface StoreAssociate {
  id: number;
  id_associate?: number;
  store_name?: string;
  store_description?: string;
  store_logo?: string;
  slug?: string;
  status?: number;
}

export interface ProductGraphic {
  id: number;
  product?: number;
  file_type?: 'img' | 'video' | 'doc';
  file_path?: number;
}

export interface RelatedProduct {
  id: number;
  product?: number;
}

