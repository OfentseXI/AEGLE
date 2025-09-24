export interface Profile {
  id: string; 
  full_name?: string | null;
  avatar_url?: string | null;
  company_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_admin?: boolean | null;
  is_authorized?: boolean | null;
  email_notifications?: boolean | null;
  notification_preferences?: NotificationType | null;
}

export type NotificationType = "email" | "in_app" | "both" | "none";

/**
 * Accountant ↔ Client relationship
 */
export interface AccountantClient {
  id: string;
  accountant_id: string; // Profile.id
  client_id: string; // Profile.id
  created_at: string;
  status?: string | null;
}

/**
 * Management Requests
 */
export interface ManagementRequest {
  id: string;
  accountant_id: string; // Profile.id
  client_id: string; // Profile.id
  request_date: string;
  period_start: string;
  period_end: string;
  completion_date?: string | null;
  notes?: string | null;
  status?: string | null; // pending, approved, etc.
}

export interface DocumentFile {
  id: string;
  ownerId: string; // profile id
  fileUrl: string;
  uploadedAt: string;
  category?: string;
}

export interface Report {
  id: string;
  businessId: string;
  createdAt: string;
  type: string; // e.g. "monthly", "annual"
  status: "draft" | "submitted" | "approved";
  fileUrl?: string;
}

/**
 * Global constants for consistency
 */
export const Constants = {
  notification_type: ["email", "in_app", "both", "none"] as NotificationType[],
};
