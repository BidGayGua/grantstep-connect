/**
 * Firestore Schema for GrantStep project
 *
 * Collection: applications
 * Document ID: applicationId (auto-generated or custom)
 *
 * Fields:
 * - userId: string (UID from Firebase Auth)
 * - specialty: string (Chosen specialty ID or name)
 * - status: 'pending' | 'accepted' | 'rejected'
 * - createdAt: timestamp (Server timestamp)
 * - updatedAt: timestamp (Server timestamp)
 *
 * Security Rule Requirement:
 * users should only be able to read/write documents where userId matches their request.auth.uid.
 */

export interface Application {
  userId: string;
  specialty: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
  updatedAt: any;
}
