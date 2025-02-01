import { GeoLocationModel } from "../domain/models/shipment.model";

export class CalculationUtils {
    static haversineDistance(origin:GeoLocationModel, destination:GeoLocationModel) {
        const toRadians = (degrees) => degrees * (Math.PI / 180);
    
        const [lon1, lat1] = origin.coordinates;
        const [lon2, lat2] = destination.coordinates;
    
        const R = 6371; // Radius of the Earth in km
    
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
    
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return (R * c).toFixed(2); // Distance in km
    }
}