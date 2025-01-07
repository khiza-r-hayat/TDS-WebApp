export class EventAPIHelper {

    static upsertEvent(eventSetup) {

        let event;

        if(eventSetup.id){
            
            return event = [{
                id: eventSetup.id,
                tenantId: eventSetup.tenantId,
                title: eventSetup.title,
                startDate: eventSetup.startDate,
                endDate: eventSetup.endDate,
                status: true,
                eventImage: "",
                addedBy: eventSetup.addedBy,
                updatedBy: eventSetup.updatedBy,
                brands: {
                    data: eventSetup.brands.map(b => ({ "brandId": b.brandId, "productId": b.productId }))
                }
            }];
        }
        else {
            return event = [{
                tenantId: eventSetup.tenantId,
                title: eventSetup.title,
                startDate: eventSetup.startDate,
                endDate: eventSetup.endDate,
                status: true,
                eventImage: eventSetup.eventImage,
                addedBy: eventSetup.addedBy,
                updatedBy: eventSetup.updatedBy,
                brands: {
                    data: eventSetup.brands.map(b => ({ "brandId": b.brandId, "productId": b.productId }))
                }
            }];
        }
    }
}