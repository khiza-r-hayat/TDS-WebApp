import { Pipe, PipeTransform } from '@angular/core';
import { CalculationUtils } from 'app/shared/core/classes/calculation_utils';
import { Utility } from 'app/shared/core/classes/utility';
import { GeoLocationModel, ShipmentModel } from 'app/shared/core/domain/models/shipment.model';

@Pipe({
  name: 'geoDistancePipe',
  standalone: true
})
export class GeoDistancePipe implements PipeTransform {

  transform(shipment:ShipmentModel): unknown {
    return CalculationUtils.haversineDistance(shipment.origin, shipment.destination);
  }

}
