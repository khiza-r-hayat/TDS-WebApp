import { BrandModel, Product, ProductModel } from "./brand.model";
import { CampaignModel } from "./campaign.modal";
import { Sponsor } from "./sponsor.model";

export interface EventModel {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  deal: string;
  startDate: Date;
  endDate: Date;
  address: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  eventImage?: string;
  integrationId?: string;
  externalEventId?: string;
  status: boolean;
  addedBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  interactionType: string;
  totalContacts: number;
  plannedSellingStocks: number;
  plannedSOGStocks: number;
  plannedGiveawayStocks: number;
  productivityTarget: number;
  activationDays: number;
  pitch: string;
  brands?: EventBrands[];
  checklists?: EventCheck[];
  evnetStockTypes?: EventStockTypeData[];
  eventSponsorStocks?: EventSponsorStock[];
  eventInventory?: EventInventory[];
  elements?: CustomFormElement[];
  sponsors?: EventSponsor[];
  campaigns?: CampaignModel[];
}

export interface EventResponse {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  deal: string;
  startDate: Date | string;
  endDate: Date | string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  eventImage: string;
  integrationId: string;
  externalEventId: string;
  status: boolean;
  addedBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  interactionType: string;
  totalContacts: number;
  plannedSellingStocks: number;
  plannedSOGStocks: number;
  plannedGiveawayStocks: number;
  productivityTarget: number;
  activationDays: number;
  pitch: string;
  brands?: any[];
  checklists?: any[];
  evnetStockTypes?: any[];
  eventSponsorStocks?: any[];
  eventInventory?: any[];
  elements: any[];
  sponsors: any[];
  owner?: any[];
  campaigns?: any[];
  userRole?: any[];
}

export interface EventRequest {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  deal: string;
  startDate: Date | string;
  endDate: Date | string;
  address: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  eventImage?: string;
  integrationId?: string;
  externalEventId?: string;
  status: boolean;
  addedBy: string;
  updatedBy: string;
  brands?: EventBrandsDataRequest;
  checklists?: EventChecklistsDataRequest;
  evnetStockTypes?: EventStockTypeDataRequest;
  interactionType: string;
  totalContacts: number;
  plannedSellingStocks: number;
  plannedSOGStocks: number;
  plannedGiveawayStocks: number;
  productivityTarget: number;
  activationDays: number;
  pitch: string;
}

export interface EventBrandsDataRequest {
  data: EventBrandRequest[];
}

export interface EventBrandRequest {
  eventId?: string;
  brandId: string;
  productId: number;
}

export interface EventChecklistsDataRequest {
  data: EventChecklistRequest[];
}

export interface EventChecklistRequest {
  eventId?: string;
  checklistId: string;
}

export interface EventStockTypeDataRequest {
  data: EventStockTypeData[];
}

export interface EventStockTypeData {
  eventId?: string;
  stockTypeId: string;
  stockType?: StockTypeModel;
}

export interface EventSponsor {
  eventId: string;
  sponsorId: string;
  sponsor?: Sponsor;
  event?: EventModel;
  createdAt?: null;
}

export interface EventBrands {
  eventId: string;
  brandId: string;
  productId: string;
  createdAt?: null;
  product?: Product;
  brand?: BrandModel;
}

export interface EventType {
  id: string;
  name: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChecklistModel {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventCheck {
  eventId: string;
  checklistId: string;
  createdAt: Date;
  checklist: ChecklistModel;
}

export interface ChecklistModelResponse {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockTypeModel {
  id: string;
  tenantId: string;
  name: string;
  hasExpiry: boolean;
  hasBatchCode: boolean;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockTypeModelResponse {
  id: string;
  tenantId: string;
  name: string;
  hasExpiry: boolean;
  hasBatchCode: boolean;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DealsModel {
  id: string;
  name: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FieldParams {
  title: string;
  type: string;
  required: boolean;
  hasOptions: boolean;
  options: string[];
}

export interface CustomFormElement {
  id: number;
  campaignId: string;
  eventId: string;
  title: string;
  type: string;
  recordType: string;
  required: boolean;
  visibility: boolean;
  helpText: string;
  fieldOrder: number;
  fieldKey: string;
  options: CustomFormElementOption[];
  mapSource: string;
  addedBy: string;
  createdAt?: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface CustomFormElementOption {
  id: number;
  elementId: number;
  option: string;
  createdAt: Date;
}

export interface SelectOption {
  id?: number;
  name: string;
}

export interface CityModel {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  areas?: AreaModel[];
}

export interface AreaModel {
  id?: string;
  cityId: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  city?: CityModel;
}

export interface EventSponsorStock {
  id?: string;
  eventId: string;
  sponsorId: string;
  brandId: string;
  productId: string;
  areaId: string;
  createdBy: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  plannedSellingStocks: number;
  plannedSOGStocks: number;
  plannedGiveawayStocks: number;
  stockDetails?: EventSponsorStockDetail[];
  area: AreaModel;
  product: Product;
}

export interface EventSponsorStockDetail {
  id?: string;
  sponsorStockId: string;
  title: string;
  description: string;
  batchCode: string;
  expiry: Date;
  stockTypeId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
  stockType: StockTypeModel;
}

export interface EventSponsorStockUpload {
  id?: string;
  eventId: string;
  sponsorId: string;
  brandId: string;
  productId: string;
  areaId: string;
  createdBy: string;
  updatedBy: string;
  plannedSellingStocks: number;
  plannedSOGStocks: number;
  plannedGiveawayStocks: number;
  stockDetails?: EventSponsorStockDetailDataUpload[];
}

export interface EventSponsorStockDetailDataUpload {
  data: EventSponsorStockDetailUpload;
}

export interface EventSponsorStockDetailUpload {
  id?: string;
  sponsorStockId: string;
  title?: string;
  description?: string;
  quantity: number;
  batchCode?: string;
  expiry?: Date;
  stockTypeId: string;
}

export interface EventInventory {
  id: string;
  eventId: string;
  title: string;
  condition: string;
  brand: string;
  model: string;
  quantity: number;
  purchaseDate: Date;
  areaId: string;
  area: AreaModel;
  createdBy: string;
  createdAt?: Date;
  updatedBy: string;
  updatedAt?: Date;
}

export interface EventInventoryUpload {
  id: string;
  eventId: string;
  title: string;
  condition: string;
  brand: string;
  model: string;
  quantity: number;
  purchaseDate: Date;
  areaId: string;
  createdBy: string;
  createdAt?: Date;
  updatedBy: string;
  updatedAt?: Date;
}
