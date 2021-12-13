<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import FormStore from '../js/store.js';
    import { get } from 'svelte/store';

    let entityId;
    let form_data;

    FormStore.subscribe((data) => {
        form_data = data;
    })

    const dispatch = createEventDispatcher();

    onMount(async () => {
        ZOHO.embeddedApp.init();
    });

    ZOHO.embeddedApp.on("PageLoad", function(data) {

        ZOHO.CRM.UI.Resize({height: 440, width: 1024});
        entityId = data.EntityId;
        

        dispatch('zoho-ready');
        
    });
    
    export async function updateZohoRecord () {
        
        let deal = await ZOHO.CRM.API.getRecord({Entity: "Deals", RecordID: entityId});

        let offer_create = {
            Entity: "Submitted_Offers",
            APIData:{
                "Street_Address" : form_data.components.number + " " + form_data.components.street,
                "City" : form_data.components.city,
                "Province" : form_data.components.province,
                "Postal_Code" : form_data.components.postal,
                "Country" : form_data.components.country,
                "Unit_Number": form_data.unit,
                "Offer_Type": form_data.offer_type,
                "Deal" : {
                    "id" : entityId
                },
                "Transaction_Type": deal.data[0].Transaction_Type,
                "Status": "Drafting",
                "Property_Type" : form_data.property_type,

            },
            Trigger: ["workflow"]
        }

        if  (form_data.hasOwnProperty('offer_date')) {
            offer_create.APIData["Offer_Date"] = form_data.offer_date + "T" + form_data.offer_time;
        }

        let deal_update = {
            Entity: "Deals",
            APIData:{
                "id": entityId,
                "Street_Address" : form_data.components.number + " " + form_data.components.street,
                "City" : form_data.components.city,
                "Province" : form_data.components.province,
                "Postal_Code" : form_data.components.postal,
                "Country" : form_data.components.country,
                "Unit_Number": form_data.unit,
            },
            Trigger: ["workflow"]
        }

        let offer_response = await ZOHO.CRM.API.insertRecord(offer_create);

        let deal_response = await ZOHO.CRM.API.updateRecord(deal_update);

        let data = {};
        if (offer_response.data[0].code == "SUCCESS" && deal_response.data[0].code == "SUCCESS") {
            data.message = `The Offer Record was created successfully.`
            data.response_code = 'success'
        } else {
            data.message = `There was an error creating the Offer Record. If this error continues talk to Cam.`;
            data.code = 'error'
        }
        
        dispatch('zoho-response', data)
        
    }
</script>