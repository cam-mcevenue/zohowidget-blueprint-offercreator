import PlaceStore from '../js/store.js';

//const dispatch = createEventDispatcher();

let place;
let inputElement;
//export let inputElement;

let autocomplete;


export function initializeAutoComplete (input) {

    inputElement = input;
    const options = {
        fields: ["formatted_address", "address_components","geometry"],
        strictBounds: false,
        types: ["address"],
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.setComponentRestrictions({
            country: ["ca"],
    });

    autocomplete.addListener("place_changed", () => {
        
        place = autocomplete.getPlace();

        //If we can find the place lets go to it
        if (typeof place.address_components !== "undefined") {
            // reset hasDownBeenPressed in case they don't unfocus
            addressChanged();
        } else {
            emitError("Please select an address from the dropdown. Don't use the 'Enter' key.");
            
        }
    });

}

function addressChanged() {
    const component_array = place.address_components;
    let new_place = {
        components : {
            number: "",
            street: "",
            city: "",
            province: "",
            country: "",
            postal: "",
            unit: "",
        },
        location: place.geometry.location,
        full_address: place.formatted_address,
    };

    for (let i = 0; i < component_array.length; i++) {
        switch (component_array[i].types[0]) {
            case "street_number":
                new_place.components.number = component_array[i].short_name;
                break
            case "route":
                new_place.components.street = component_array[i].short_name;
                break
            case "locality":
                new_place.components.city = component_array[i].short_name;
                break
            case "administrative_area_level_1":
                new_place.components.province = component_array[i].short_name;
                break
            case "country":
                new_place.components.country = component_array[i].long_name;
                break
            case "postal_code":
                new_place.components.postal = component_array[i].short_name.split(" ").join("");
                break
            default:
                break
            }   
        delete place.address_components;

    }

    inputElement.value = place.formatted_address;
    PlaceStore.update(currentForm => {
        return {
            ...currentForm,
            ...new_place
        };
    })
    
}

function emitError(message) {
    /*dispatch('error', {
        message: message
    })*/
    console.log(message);
}