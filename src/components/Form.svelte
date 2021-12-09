<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { 
        Form,
        FormGroup, 
        TextInput, 
        Dropdown,
        DatePicker, 
        DatePickerInput,
        Button,
        ButtonSet,
        Grid,
        Row,
        Column,
        ToastNotification,
    } from 'carbon-components-svelte';

    import Save32 from "carbon-icons-svelte/lib/Save32";

    import ZohoUtils from './ZohoUtils.svelte';

    import { initializeAutoComplete } from '../js/autocomplete.js';
    import FormStore from '../js/store.js';
    import { get } from 'svelte/store';

    let input;
    let unit = null;
    let offer_type;
    let offer_type_invalid = false;
    let offer_date = null;
    let offer_date_invalid = false;
    let offer_time = null;
    let offer_time_invalid = false;
    let address_invalid = false;
    let offerDateActive = false;

    let zohoUtils;
	let zohoResponse;
    let showError = false;

    let offer_types = [
        {
            id : undefined,
            text: "Select offer type...",
        },
        {
            id : "Bully",
            text: "Bully",
        },
        {
            id : "Offer Night",
            text: "Offer Night",
        },
        {
            id : "Offers Anytime",
            text: "Offers Anytime",
        }
    ]

    let times = [
        {
            id : undefined,
            text: "Select time...",
        },
        {
            id : "12:00:00",
            text: "12:00 PM",
        },
        {
            id : "12:30:00",
            text: "12:30 PM",
        },
        {
            id : "13:00:00",
            text: "1:00 PM",
        },
        {
            id : "13:30:00",
            text: "1:30 PM",
        },
        {
            id : "14:00:00",
            text: "2:00 PM",
        },
        {
            id : "14:30:00",
            text: "2:30 PM",
        },
        {
            id : "15:00:00",
            text: "3:00 PM",
        },
        {
            id : "15:30:00",
            text: "3:30 PM",
        },
        {
            id : "16:00:00",
            text: "4:00 PM",
        },
        {
            id : "16:30:00",
            text: "4:30 PM",
        },
        {
            id : "17:00:00",
            text: "5:00 PM",
        },
        {
            id : "17:30:00",
            text: "5:30 PM",
        },
        {
            id : "18:00:00",
            text: "6:00 PM",
        },
        {
            id : "18:30:00",
            text: "6:30 PM",
        },
        {
            id : "19:00:00",
            text: "7:00 PM",
        },
        {
            id : "19:30:00",
            text: "7:30 PM",
        },
        {
            id : "20:00:00",
            text: "8:00 PM",
        },
        {
            id : "20:30:00",
            text: "8:30 PM",
        },
        {
            id : "21:00:00",
            text: "9:00 PM",
        },
    ]
    
    onMount(async () => {
        initializeAutoComplete(input);
    });

    FormStore.subscribe((data) => {
        if ( data !== undefined ) {
            if (data.location !== undefined) {
                address_invalid = false;
            }
        }
    });

    function handleUnitChange(e) {
        updateFormStore({unit : unit});
    }

    function handleOfferTypeChange (e) {
        offer_type = e.detail.selectedId

        if (e.detail.selectedId == "Offer Night") {
            offerDateActive = true;
        } else {
            offerDateActive = false;
        }

        if (e.detail.selectedId != undefined ) {
            offer_type_invalid = false;
        }

        updateFormStore({offer_type : offer_type});
    }

    function handleTimeChange (e) {
        offer_time = e.detail.selectedId

        if (e.detail.selectedId != undefined ) {
            offer_time_invalid = false;
        }
        updateFormStore({offer_time : offer_time});
    }

    function handleDateChange (e) {
        offer_date = e.detail.dateStr
    
        if (offer_date != undefined ) {
            offer_date_invalid = false;
        }
        updateFormStore({offer_date : offer_date});
    }

    function updateFormStore(obj) {
        FormStore.update(currentForm => {
            return {
                ...currentForm,
                ...obj,
            }
        })

    }

    function validateForm (e) {
        e.preventDefault();
        let dirty = false;
        offer_type_invalid = false;
        offer_date_invalid = false;
        offer_time_invalid = false;
        address_invalid = false;
 
        let place = get(FormStore);

 
        if ( offer_type == undefined ) {
            offer_type_invalid = true;
            dirty = true;
        }

        if ( offerDateActive && offer_date == "") {
            offer_date_invalid = true;
            dirty = true;
        }

        if ( offerDateActive && offer_time == undefined ) {
            offer_time_invalid = true;
            dirty = true;
        }

        if ( place == undefined || place.location == undefined ) {
            address_invalid = true;
            dirty = true;
        }

        if (!dirty) {
            zohoUtils.updateZohoRecord();
        }
    }

    function zohoReady() {

    }

    function handleZohoResponse (event) {
        zohoResponse = event.detail;
        if (zohoResponse.code == 'error') {
            showError = true;
            return
        }

        ZOHO.CRM.BLUEPRINT.proceed();
    }

    function closeWidget() {
        ZOHO.CRM.UI.Popup.close();
    }

</script>

<style>
    :global fieldset.bx--fieldset {
        margin-bottom: 0.75rem;
    }

    :global fieldset > legend.bx--label {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.375;
        letter-spacing: 0;
    }

    :global .bx--form-item, :global .bx--dropdown__wrapper {
        margin-bottom: 14px;
    }

    :global .bx--date-picker.bx--date-picker--single .bx--date-picker__input {
        width: 100% !important;
    }

    :global .flatpickr-calendar.bx--date-picker__calendar {
        top: unset !important;
        bottom: 224px !important;
    }

    :global .bx--toast-notification.bx--toast-notification--error {
        width: 100%;
    }

</style>

    <Form on:submit={validateForm} novalidate>
        <FormGroup legendText="Property Address" >
            <TextInput 
                    labelText="Unit # (optional)"
                    placeholder="ex. 1107"
                    bind:value={unit}
                    on:change={handleUnitChange}
            />
            <TextInput 
                labelText="Property Address"
                placeholder="Start typing an address..."
                bind:ref={input}
                required=true
                invalid={address_invalid}
            />
        </FormGroup>
        <FormGroup legendText="Offer Info">
            <Dropdown
                titleText="Offer Type"
                selectedIndex={0}
                items={offer_types}
                style="padding-top: 0.5rem;"
                bind:value={offer_type}
                on:select={handleOfferTypeChange}
                type="default"
                invalid={offer_type_invalid}
                invalidText="Please select an Offer Type"
            />
            {#if offerDateActive}
            <Grid fullWidth style="padding: 0;">
                <Row>
                    <Column>
                        <DatePicker 
                            datePickerType="single"
                            bind:value={offer_date}
                            on:change={handleDateChange}
                            required=true
                            dateFormat="Y-m-d"
                                    >
                            <DatePickerInput 
                                labelText="When is offer night?" 
                                placeholder="yyyy-mm-dd" 
                                invalid={offer_date_invalid}
                                invalidText="Please select an Offer Date."
                            />
                        </DatePicker>
                    </Column>
                    <Column>
                        <Dropdown
                            titleText="Time"
                            selectedIndex={0}
                            items={times}
                            bind:value={offer_time}
                            on:select={handleTimeChange}
                            required=true
                            invalid={offer_time_invalid}
                            invalidText="Please select an Offer Time."
                            direction="top"

                        />
                    </Column>
                </Row>
            </Grid>
            {/if}
        </FormGroup>
        <FormGroup style="text-align: right;">
            <Button kind="tertiary" on:click={closeWidget}>Cancel</Button>
            <Button kind="primary" icon={Save32} type="submit">Save</Button>
        </FormGroup>
        {#if showError} 
        <div transition:fade>
            <ToastNotification
                lowContrast
                kind="error"
                title="Error"
                subtitle={zohoResponse.message}
                caption={new Date().toLocaleString()}
                hidden=true
            />
        </div>
        {/if }
    </Form>

    <ZohoUtils bind:this={zohoUtils} on:zoho-ready={zohoReady} on:zoho-response={handleZohoResponse} />
                
                
     

