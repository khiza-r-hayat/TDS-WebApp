import gql from "graphql-tag";

export const logAction = gql`
  mutation cloudLoggingAction($request: RequestInput!) {
    googleCloudLogging(request: $request)
  }
`;

export const emailAction = gql`
  query mailChimpIntegrationAction($request: mailChimpInput!) {
    mailChimpIntegration(request: $request) {
      data
    }
  }
`;

// export const googleSheetsAction = gql`
//     query goolgeSheetApiAction($request: GSheetInput!) {
//         goolgeSheetApi(request: $request) {
//             status
//             data
//         }
//     }`;

// export const bizzaboIntegrationAction = gql`
// query bizzaboIntegrationQL($request: BizzaboInput!) {
//     bizzaboIntegration(request: $request) {
// 			status
// 			data
//         }
//     }`;
