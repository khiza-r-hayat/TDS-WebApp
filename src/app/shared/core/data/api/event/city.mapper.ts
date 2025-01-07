import { CityModel } from "app/shared/core/domain/models/event.model";
import { Mapper } from "../../../base/mapper";

export class CityMapper extends Mapper<CityModel, CityModel> {
  mapFrom(param: CityModel): CityModel {
    return {
      id: param.id,
      name: param.name,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      areas: param.areas,
    };
  }

  mapTo(param: CityModel): CityModel {
    return {
      id: param.id,
      name: param.name,
      createdAt: param.createdAt,
      updatedAt: param.updatedAt,
      areas: param.areas,
    };
  }
}
