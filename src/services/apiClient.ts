/**
 * API Client Service
 * Uses ApiConfigManager for all domain configuration
 * Domain: aibytez.co
 */

import ApiConfigManager from '../config/api';

export interface RequestOptions extends RequestInit {
    timeout?: number;
}

export interface ApiResponse<T = unknown> {
    data: T | null;
    error: string | null;
    status: number;
}

/**
 * Base API client that uses ApiConfigManager for URL resolution.
 * All requests are made relative to the configured base URL.
 */
export class ApiClient {
    private static instance: ApiClient | null = null;

  static getInstance(): ApiClient {
        if (!this.instance) {
                this.instance = new ApiClient();
        }
        return this.instance;
  }

  private getBaseUrl(): string {
        return ApiConfigManager.baseUrl;
  }

  private getN8nUrl(): string {
        return ApiConfigManager.n8nUrl;
  }

  private getMediaApiUrl(): string {
        return ApiConfigManager.mediaApiUrl;
  }

  async request<T = unknown>(
        path: string,
        options: RequestOptions = {}
      ): Promise<ApiResponse<T>> {
        const { timeout = 10000, ...fetchOptions } = options;
        const url = `${this.getBaseUrl()}${path}`;

      const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
              const response = await fetch(url, {
                        ...fetchOptions,
                        signal: controller.signal,
                        headers: {
                                    'Content-Type': 'application/json',
                                    ...fetchOptions.headers,
                        },
              });

          clearTimeout(timeoutId);

          if (!response.ok) {
                    return {
                                data: null,
                                error: `HTTP error ${response.status}: ${response.statusText}`,
                                status: response.status,
                    };
          }

          const data = await response.json() as T;
              return { data, error: null, status: response.status };
      } catch (err) {
              clearTimeout(timeoutId);
              const message = err instanceof Error ? err.message : 'Unknown error';
              return { data: null, error: message, status: 0 };
      }
  }

  async get<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T = unknown>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(path, {
                ...options,
                method: 'POST',
                body: JSON.stringify(body),
        });
  }

  async put<T = unknown>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(path, {
                ...options,
                method: 'PUT',
                body: JSON.stringify(body),
        });
  }

  async delete<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  getConfig() {
        return {
                baseUrl: this.getBaseUrl(),
                n8nUrl: this.getN8nUrl(),
                mediaApiUrl: this.getMediaApiUrl(),
                environment: ApiConfigManager.environment,
        };
  }
}

export const apiClient = ApiClient.getInstance();
export default apiClient;
