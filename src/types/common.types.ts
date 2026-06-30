// ─────────────────────────────────────────────────────────────
// Common / shared types used across the entire ITA portal
// ─────────────────────────────────────────────────────────────

/** Generic paginated list wrapper returned by every list endpoint. */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Standard pagination query params sent to the API. */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** Generic API envelope – every endpoint returns this shape. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/** Error response shape from the API. */
export interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

/** Sort direction. */
export type SortDirection = 'asc' | 'desc';

/** Generic sort param. */
export interface SortParams<TField extends string = string> {
  sortBy: TField;
  sortDirection: SortDirection;
}

/** Used for select / dropdown options throughout the app. */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

/** Timestamp mixin used by every entity. */
export interface Timestamped {
  createdAt: string; // ISO-8601
  updatedAt: string;
}

/** Soft-delete mixin. */
export interface SoftDeletable {
  deletedAt: string | null;
  isDeleted: boolean;
}

/** Audit trail entry. */
export interface AuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'status_change';
  performedBy: string;
  changes: Record<string, { from: unknown; to: unknown }>;
  timestamp: string;
}

/** Generic ID type – all entities use UUID strings. */
export type EntityId = string;

/** Date range filter. */
export interface DateRange {
  from: string; // ISO-8601
  to: string;
}

/** Search / filter base. */
export interface BaseFilters extends PaginationParams {
  search?: string;
  dateRange?: DateRange;
}

/** Status badge variant mapping. */
export type StatusVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'ai';

/** Tab definition for tabbed UIs. */
export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: string;
}

/** Breadcrumb segment. */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Toast / notification severity. */
export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  title: string;
  message?: string;
  severity: NotificationSeverity;
  duration?: number; // ms – 0 = persistent
  createdAt: string;
}
