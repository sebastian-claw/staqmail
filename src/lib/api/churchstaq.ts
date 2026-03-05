/**
 * ChurchStaq (Pushpay) API client
 * Handles authentication and email-related API calls.
 */

export interface ChurchStaqCredentials {
  apiKey: string;
  organizationSlug: string;
  baseUrl?: string;
}

export interface EmailListItem {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  status: "draft" | "sent" | "scheduled";
}

const DEFAULT_BASE_URL = "https://api.pushpay.com/v1";

export class ChurchStaqClient {
  private apiKey: string;
  private orgSlug: string;
  private baseUrl: string;

  constructor(credentials: ChurchStaqCredentials) {
    this.apiKey = credentials.apiKey;
    this.orgSlug = credentials.organizationSlug;
    this.baseUrl = credentials.baseUrl ?? DEFAULT_BASE_URL;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async verifyCredentials(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/merchant/${this.orgSlug}`, {
        headers: this.headers,
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async sendEmail(payload: {
    subject: string;
    htmlBody: string;
    recipientListId?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const res = await fetch(
        `${this.baseUrl}/merchant/${this.orgSlug}/communications`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({
            subject: payload.subject,
            body: payload.htmlBody,
            type: "Email",
            recipientListId: payload.recipientListId,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        return { success: false, error: err };
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
}

// Singleton factory — populated after auth
let _client: ChurchStaqClient | null = null;

export function getClient(): ChurchStaqClient | null {
  return _client;
}

export function initClient(credentials: ChurchStaqCredentials): ChurchStaqClient {
  _client = new ChurchStaqClient(credentials);
  return _client;
}

export function clearClient() {
  _client = null;
}
