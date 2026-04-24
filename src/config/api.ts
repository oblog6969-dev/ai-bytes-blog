/**
 * API Configuration Manager
 * Central configuration for all API endpoints
 * Domain: aibytez.co
 */

export interface ApiConfig {
    baseUrl: string;
    n8nUrl: string;
    mediaApiUrl: string;
    environment: 'production' | 'staging' | 'development';
}

const PRODUCTION_CONFIG: ApiConfig = {
    baseUrl: 'https://aibytez.co',
    n8nUrl: 'https://n8n.aibytez.co',
    mediaApiUrl: 'https://media.aibytez.co/api',
    environment: 'production',
};

const STAGING_CONFIG: ApiConfig = {
    baseUrl: 'https://staging.aibytez.co',
    n8nUrl: 'https://n8n-staging.aibytez.co',
    mediaApiUrl: 'https://media-staging.aibytez.co/api',
    environment: 'staging',
};

const DEVELOPMENT_CONFIG: ApiConfig = {
    baseUrl: 'http://localhost:3000',
    n8nUrl: 'http://localhost:5678',
    mediaApiUrl: 'http://localhost:3001/api',
    environment: 'development',
};

/**
 * ApiConfigManager provides the correct API configuration
 * based on the current environment.
 */
export class ApiConfigManager {
    private static config: ApiConfig | null = null;

  static getConfig(): ApiConfig {
        if (this.config) return this.config;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

      if (apiUrl.includes('staging.aibytez.co')) {
              this.config = STAGING_CONFIG;
      } else if (apiUrl.includes('aibytez.co')) {
              this.config = PRODUCTION_CONFIG;
      } else {
              this.config = DEVELOPMENT_CONFIG;
      }

      return this.config;
  }

  static get baseUrl(): string {
        return this.getConfig().baseUrl;
  }

  static get n8nUrl(): string {
        return this.getConfig().n8nUrl;
  }

  static get mediaApiUrl(): string {
        return this.getConfig().mediaApiUrl;
  }

  static get environment(): string {
        return this.getConfig().environment;
  }

  static isProduction(): boolean {
        return this.getConfig().environment === 'production';
  }

  static isStaging(): boolean {
        return this.getConfig().environment === 'staging';
  }

  static isDevelopment(): boolean {
        return this.getConfig().environment === 'development';
  }
}

export default ApiConfigManager;
