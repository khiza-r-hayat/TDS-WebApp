import gql from "graphql-tag";
import {
  ChecklistQL,
  StockTypeQL,
  TenantDashboardEventQL,
  TenantEventQL,
} from "../fragments/event.fragment";

export const getTenantEventQL = gql`
  query getTenantEventQL($id: uuid!) {
    event(where: { tenantId: { _eq: $id } }) {
      ...TenantEventQL
    }
    checklist(where: { tenantId: { _eq: $id } }) {
      ...ChecklistQL
    }
    stock_type(where: { tenantId: { _eq: $id } }) {
      ...StockTypeQL
    }
  }
  ${TenantEventQL}
  ${ChecklistQL}
  ${StockTypeQL}
`;

export const getTenantDashboardEventsQL = gql`
  query getTenantEventQL($id: uuid!) {
    event(where: { tenantId: { _eq: $id } }) {
      id
      title
    }
  }
`;
// ${TenantDashboardEventQL}
export const getDashboardCampaignEventQL = gql`
  query getDashboardCampaignEventQL($tenantId: uuid!, $sponsorId: uuid!) {
    event(
      where: {
        _and: [
          { tenantId: { _eq: $tenantId } }
          { sponsors: { sponsorId: { _eq: $sponsorId } } }
        ]
      }
    ) {
      id
      title
    }
  }
`;

export const DashboardEventWithCamapignsQL = gql`
  query DashboardEventWithCamapignsQL($id: uuid!) {
    event(where: { id: { _eq: $id } }) {
      ...TenantDashboardEventQL
    }
  }

  ${TenantDashboardEventQL}
`;

export const getTenantIdQL = gql`
  query getTenantIdQL($id: uuid!) {
    event(where: { id: { _eq: $id } }) {
      ...TenantEventQL
    }
  }
  ${TenantEventQL}
`;

export const getLocationsQL = gql`
  query getLocationsQL {
    city {
      id
      name
      areas {
        id
        cityId
        name
      }
    }
  }
`;

export const getChecklistsAndStockTypesByTenantIdQL = gql`
  query getChecklistsAndStockTypesByTenantIdQL($id: uuid!) {
    checklist(where: { tenantId: { _eq: $id } }) {
      ...ChecklistQL
    }
    stock_type(where: { tenantId: { _eq: $id } }) {
      ...StockTypeQL
    }
  }
  ${ChecklistQL}
  ${StockTypeQL}
`;

export const AddEventQL = gql`
  mutation AddEventQL(
    $objects: [event_insert_input!]!
    $update: Boolean!
    $eventId: uuid!
  ) {
    delete_event_brand(where: { eventId: { _eq: $eventId } })
      @include(if: $update) {
      affected_rows
    }
    delete_event_checklist(where: { eventId: { _eq: $eventId } })
      @include(if: $update) {
      affected_rows
    }
    delete_event_stock_type(where: { eventId: { _eq: $eventId } })
      @include(if: $update) {
      affected_rows
    }
    insert_event(
      objects: $objects
      on_conflict: {
        constraint: organization_event_pkey
        update_columns: [
          title
          startDate
          endDate
          eventImage
          integrationId
          externalEventId
          updatedBy
          interactionType
          totalContacts
          plannedSellingStocks
          plannedSOGStocks
          plannedGiveawayStocks
          productivityTarget
          activationDays
          pitch
        ]
      }
    ) {
      returning {
        ...TenantEventQL
      }
    }
  }
  ${TenantEventQL}
`;

export const upsertEventElementsQL = gql`
  mutation insert_lead_form_element(
    $objects: [lead_form_element_insert_input!]!
    $options: [lead_form_element_option_insert_input!]!
  ) {
    insert_lead_form_element(
      objects: $objects
      on_conflict: {
        constraint: lead_form_element_pkey
        update_columns: [
          campaignId
          title
          type
          required
          visibility
          recordType
          helpText
          fieldOrder
          mapSource
          updatedBy
        ]
      }
    ) {
      returning {
        id
      }
    }

    insert_lead_form_element_option(
      objects: $options
      on_conflict: {
        constraint: lead_form_element_option_pkey
        update_columns: [option]
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export const UpsertEventSponsorsWithCampaignsQL = gql`
  mutation UpsertEventSponsorsWithCampaignsQL(
    $sponsors: [event_sponsor_insert_input!]!
    $campaigns: [campaign_insert_input!]!
  ) {
    insert_event_sponsor(
      objects: $sponsors
      on_conflict: { constraint: event_sponsor_pkey, update_columns: [] }
    ) {
      affected_rows
    }
    insert_campaign(
      objects: $campaigns
      on_conflict: {
        constraint: campaign_eventId_sponsorId_key
        update_columns: [
          title
          pitch
          disclaimer
          updatedBy
          status
          campaignEmailFlag
        ]
      }
    ) {
      affected_rows
    }
  }
`;

export const UpsertSponsorStockQL = gql`
  mutation upsertSponsorStockQL(
    $stocks: [event_sponsor_stock_insert_input!]!
    $stockDetails: [event_sponsor_stock_detail_insert_input!]!
  ) {
    insert_event_sponsor_stock(
      objects: $stocks
      on_conflict: {
        constraint: event_sponsor_stock_pkey
        update_columns: [
          sponsorId
          brandId
          productId
          areaId
          updatedBy
          plannedSellingStocks
          plannedSOGStocks
          plannedGiveawayStocks
        ]
      }
    ) {
      affected_rows
    }
    insert_event_sponsor_stock_detail(
      objects: $stockDetails
      on_conflict: {
        constraint: event_sponsor_stock_detail_pkey
        update_columns: [
          title
          description
          batchCode
          expiry
          quantity
          stockTypeId
        ]
      }
    ) {
      affected_rows
    }
  }
`;

export const UpserteventInventoryQL = gql`
  mutation UpserteventInventoryQL($inventories: [inventory_insert_input!]!) {
    insert_inventory(
      objects: $inventories
      on_conflict: {
        constraint: inventory_pkey
        update_columns: [
          title
          quantity
          brand
          condition
          model
          areaId
          purchaseDate
          updatedBy
        ]
      }
    ) {
      affected_rows
    }
  }
`;

export const DeleteEventElementsQL = gql`
  mutation deleteElementsOptionsQL(
    $fieldsToDelete: [uuid!]!
    $optionsToDelete: [uuid!]!
    $bulkdDeleteRequired: Boolean!
  ) {
    OptionsDeletedResponse: delete_lead_form_element_option(
      where: { _and: [{ id: { _in: $optionsToDelete } }] }
    ) @include(if: $bulkdDeleteRequired) {
      affected_rows
    }
    ElementsDeletedResponse: delete_lead_form_element(
      where: { _and: [{ id: { _in: $fieldsToDelete } }] }
    ) @include(if: $bulkdDeleteRequired) {
      affected_rows
    }
  }
`;

export const DeleteEventSponsorsQL = gql`
  mutation deleteEventSponsorsQL($ids: [uuid!]!, $eventId: uuid!) {
    delete_event_sponsor(where: { sponsorId: { _in: $ids } }) {
      affected_rows
    }
    delete_event_sponsor_stock(
      where: {
        _and: [{ eventId: { _eq: $eventId } }, { sponsorId: { _in: $ids } }]
      }
    ) {
      affected_rows
    }
    delete_campaign(
      where: {
        _and: [{ eventId: { _eq: $eventId } }, { sponsorId: { _in: $ids } }]
      }
    ) {
      affected_rows
    }
  }
`;

export const DeleteEventSponsorStockDetailQL = gql`
  mutation deleteEventSponsorsQL($ids: [uuid!]!) {
    delete_event_sponsor_stock_detail(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;

export const DeleteEventInventoryQL = gql`
  mutation DeleteEventInventoryQL($ids: [uuid!]!) {
    delete_inventory(where: { id: { _in: $ids } }) {
      affected_rows
    }
  }
`;
