import { inject, Pipe, PipeTransform } from "@angular/core";
import { BrandService } from "app/shared/core/domain/services/brand.service";

@Pipe({
  name: "brandnamepipe",
  standalone: true,
})
export class BrandNamePipe implements PipeTransform {
  private service = inject(BrandService);
  transform(brandId): unknown {
    const brand = this.service.brands().find((b) => b.id === brandId);
    return brand ? brand.name : "";
  }
}
