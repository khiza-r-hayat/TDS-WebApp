import gql from "graphql-tag";
import { BrandProductsQL, BrandsQL } from "./brand.fragment";
import { CampaignDashboardQL } from "./capmaign.fragment";

export const ChecklistQL = gql`
  fragment ChecklistQL on checklist {
    id
    tenantId
    name
    status
    createdAt
    updatedAt
  }
`;

export const StockTypeQL = gql`
  fragment StockTypeQL on stock_type {
    id
    tenantId
    name
    hasExpiry
    hasBatchCode
    status
    createdAt
    updatedAt
  }
`;

export const StockDetailsQL = gql`
  fragment StockDetailsQL on event_sponsor_stock_detail {
    id
    sponsorStockId
    title
    description
    stockTypeId
    quantity
    batchCode
    expiry
    createdAt
    updatedAt
    stockType {
      ...StockTypeQL
    }
  }
  ${StockTypeQL}
`;

export const AreaQL = gql`
  fragment AreaQL on area {
    id
    cityId
    name
    city {
      id
      name
    }
  }
`;

export const EvnetSponsorStockQL = gql`
  fragment EvnetSponsorStockQL on event_sponsor_stock {
    id
    eventId
    sponsorId
    brandId
    productId
    areaId
    createdBy
    updatedBy
    createdAt
    updatedAt
    plannedSellingStocks
    plannedSOGStocks
    plannedGiveawayStocks
    stockDetails {
      ...StockDetailsQL
    }
    area {
      ...AreaQL
    }
    product {
      id
      name
      brand {
        id
        name
      }
    }
  }
  ${AreaQL}
  ${StockDetailsQL}
`;

export const InventoryQl = gql`
  fragment InventoryQl on inventory {
    id
    eventId
    areaId
    title
    condition
    brand
    model
    quantity
    purchaseDate
    createdBy
    createdAt
    updatedBy
    updatedAt
    area {
      ...AreaQL
    }
  }
  ${AreaQL}
`;

export const CampaignEventQL = gql`
  fragment CampaignEventQL on event {
    id
    title
    tenantId
    startDate
    endDate
    addedBy
    updatedBy
    type
    deal
    interactionType
    totalContacts
    productivityTarget
    plannedSellingStocks
    plannedSOGStocks
    plannedGiveawayStocks
    activationDays
    pitch
    eventInventory {
      ...InventoryQl
    }
    eventSponsorStocks {
      ...EvnetSponsorStockQL
    }
  }
  ${InventoryQl}
  ${EvnetSponsorStockQL}
`;

export const TenantEventQL = gql`
  fragment TenantEventQL on event {
    id
    tenantId
    addedBy
    title
    type
    deal
    startDate
    endDate
    address
    zipCode
    country
    countryCode
    state
    city
    eventImage
    integrationId
    externalEventId
    status
    productivityTarget
    activationDays
    interactionType
    totalContacts
    plannedSOGStocks
    plannedSellingStocks
    plannedGiveawayStocks
    pitch
    updatedBy
    createdAt
    updatedAt
    brands {
      eventId
      brandId
      productId
      product {
        ...BrandProductsQL
      }
      brand {
        ...BrandsQL
      }
    }
    campaigns {
      ...CampaignDashboardQL
    }
    checklists {
      eventId
      checklistId
      checklist {
        ...ChecklistQL
      }
    }
    evnetStockTypes {
      eventId
      stockTypeId
      stockType {
        ...StockTypeQL
      }
    }
    eventSponsorStocks {
      ...EvnetSponsorStockQL
    }
    eventInventory {
      ...InventoryQl
    }
    sponsors {
      eventId
      sponsorId
    }
    elements(order_by: { fieldOrder: asc }) {
      id
      campaignId
      addedBy
      title
      type
      recordType
      required
      visibility
      fieldKey
      helpText
      fieldOrder
      mapSource
      updatedBy
      updatedAt
      createdAt
      options {
        id
        elementId
        option
        createdAt
      }
    }
  }

  ${BrandProductsQL}
  ${CampaignDashboardQL}
  ${BrandsQL}
  ${ChecklistQL}
  ${StockTypeQL}
  ${StockDetailsQL}
  ${EvnetSponsorStockQL}
  ${InventoryQl}
`;

export const TenantDashboardEventQL = gql`
  fragment TenantDashboardEventQL on event {
    id
    tenantId
    addedBy
    title
    type
    deal
    startDate
    endDate
    integrationId
    externalEventId
    status
    productivityTarget
    activationDays
    interactionType
    totalContacts
    plannedSOGStocks
    plannedSellingStocks
    plannedGiveawayStocks
    pitch
    updatedBy
    createdAt
    updatedAt
    evnetStockTypes {
      eventId
      stockTypeId
      stockType {
        ...StockTypeQL
      }
    }
    eventSponsorStocks {
      ...EvnetSponsorStockQL
    }
    campaigns {
      ...CampaignDashboardQL
    }
  }
  ${EvnetSponsorStockQL}
  ${StockDetailsQL}
  ${StockTypeQL}
  ${CampaignDashboardQL}
`;
