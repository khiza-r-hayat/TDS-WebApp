declare global {
    interface Window {
      google: typeof google;
    }
  }
  
  declare namespace google.maps {
    export interface PlaceResult {
      geometry?: {
        location?: {
          lat(): number;
          lng(): number;
        };
      };
      formatted_address?: string;
    }
  }
  
  export {};