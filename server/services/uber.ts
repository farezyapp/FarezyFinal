import fetch from 'node-fetch';

interface UberProduct {
  product_id: string;
  description: string;
  display_name: string;
  capacity: number;
  image: string;
}

interface UberPriceEstimate {
  product_id: string;
  currency_code: string;
  display_name: string;
  estimate: string;
  low_estimate: number;
  high_estimate: number;
  surge_multiplier: number;
  duration: number;
  distance: number;
}

interface UberTimeEstimate {
  product_id: string;
  display_name: string;
  estimate: number;
}

export class UberService {
  private baseUrl = 'https://api.uber.com/v1.2';
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.clientId = process.env.UBER_CLIENT_ID!;
    this.clientSecret = process.env.UBER_CLIENT_SECRET!;
    
    if (!this.clientId || !this.clientSecret) {
      throw new Error('UBER_CLIENT_ID and UBER_CLIENT_SECRET are required');
    }
  }

  private async getAccessToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Try multiple scope configurations
    const scopeConfigs = [
      '', // No scope (some APIs work without explicit scope)
      'request', // Basic request scope
      'profile', // Profile scope only
      'request.history', // History scope
    ];

    for (const scope of scopeConfigs) {
      try {
        const tokenUrl = 'https://login.uber.com/oauth/v2/token';
        const params = new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        });
        
        if (scope) {
          params.append('scope', scope);
        }

        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        });

        if (response.ok) {
          const tokenData = await response.json() as any;
          this.accessToken = tokenData.access_token;
          this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000;
          
          console.log(`✓ Uber OAuth successful with scope: "${scope || 'none'}"`);
          return this.accessToken!;
        }
        
        const errorText = await response.text();
        console.log(`✗ Scope "${scope || 'none'}" failed:`, errorText);
        
      } catch (error) {
        console.log(`✗ Scope "${scope || 'none'}" error:`, (error as Error).message);
      }
    }

    // All scope configurations failed
    throw new Error('Uber API authentication failed with all scope configurations. The API may require manual user authorization instead of client credentials flow.');
  }

  private async makeRequest(endpoint: string, params: URLSearchParams) {
    const accessToken = await this.getAccessToken();
    const url = `${this.baseUrl}${endpoint}?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Uber API error: ${response.status} ${response.statusText}`, errorText);
      
      if (response.status === 401) {
        // Token might be expired, clear it and retry once
        this.accessToken = null;
        this.tokenExpiry = null;
        throw new Error('Uber API authentication failed. Please verify your client credentials.');
      }
      
      throw new Error(`Uber API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async getProducts(latitude: number, longitude: number): Promise<UberProduct[]> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    const data = await this.makeRequest('/products', params) as any;
    return data.products || [];
  }

  async getPriceEstimates(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number
  ): Promise<UberPriceEstimate[]> {
    const params = new URLSearchParams({
      start_latitude: startLatitude.toString(),
      start_longitude: startLongitude.toString(),
      end_latitude: endLatitude.toString(),
      end_longitude: endLongitude.toString(),
    });

    const data = await this.makeRequest('/estimates/price', params) as any;
    return data.prices || [];
  }

  async getTimeEstimates(
    startLatitude: number,
    startLongitude: number,
    customerUuid?: string,
    productId?: string
  ): Promise<UberTimeEstimate[]> {
    const params = new URLSearchParams({
      start_latitude: startLatitude.toString(),
      start_longitude: startLongitude.toString(),
    });

    if (customerUuid) {
      params.append('customer_uuid', customerUuid);
    }
    if (productId) {
      params.append('product_id', productId);
    }

    const data = await this.makeRequest('/estimates/time', params) as any;
    return data.times || [];
  }

  // Helper method to format estimates for our app's ride comparison
  async getRideEstimates(
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number
  ) {
    try {
      const [priceEstimates, timeEstimates] = await Promise.all([
        this.getPriceEstimates(startLatitude, startLongitude, endLatitude, endLongitude),
        this.getTimeEstimates(startLatitude, startLongitude),
      ]);

      const rides = priceEstimates.map(price => {
        const timeEstimate = timeEstimates.find(time => time.product_id === price.product_id);
        
        return {
          service: 'Uber',
          type: price.display_name,
          price: price.estimate,
          priceRange: {
            min: price.low_estimate,
            max: price.high_estimate,
          },
          currency: price.currency_code,
          eta: timeEstimate ? Math.round(timeEstimate.estimate / 60) : null,
          duration: Math.round(price.duration / 60),
          distance: Math.round(price.distance * 1.60934),
          surge: price.surge_multiplier > 1 ? price.surge_multiplier : null,
          productId: price.product_id,
          bookingUrl: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${endLatitude}&dropoff[longitude]=${endLongitude}`,
        };
      });

      return rides;
    } catch (error) {
      console.error('Error getting Uber estimates:', error);
      
      // API credentials issue - inform user
      if ((error as Error).message?.includes('authentication') || (error as Error).message?.includes('unauthorized') || (error as Error).message?.includes('manual user authorization')) {
        console.log(`
===========================================
UBER API AUTHENTICATION ISSUE
===========================================

${(error as Error).message}

CURRENT STATUS:
✓ UBER_CLIENT_ID: ${process.env.UBER_CLIENT_ID ? 'CONFIGURED' : 'MISSING'}
✓ UBER_CLIENT_SECRET: ${process.env.UBER_CLIENT_SECRET ? 'CONFIGURED' : 'MISSING'}

POSSIBLE SOLUTIONS:
1. Uber may have restricted client credentials flow
2. API might require user-based OAuth (3-legged) instead
3. App might need approval for production access
4. Try enabling different scopes in developer dashboard

ALTERNATIVE: Consider implementing user-based OAuth flow
instead of client credentials for Uber API access.
===========================================
        `);
      }
      
      return [];
    }
  }
}

export const uberService = new UberService();