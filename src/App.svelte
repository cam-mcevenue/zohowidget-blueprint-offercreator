<script>
	
	import { fade } from 'svelte/transition';
	import { mapsAPIKey } from './js/key';

	import {Grid, Row, Column } from 'carbon-components-svelte';

	import Map from './components/Map.svelte';
	import Form from './components/Form.svelte';

	export let mapsReady;

	let map;
	let place;
	let address;
	let unitNumber ='';
	let valid_address = true;
	let error_msg;

	function validateForm () {
		
		let form_valid = validateAddressInput();
		
		if (form_valid) {
			place.components.unit = unitNumber,
			zohoUtils.updateZohoRecord(place.components);
		}
		
	}

	function closeWidget() {
		ZOHO.CRM.UI.Popup.close();
	}

	function handleZohoResponse(event) {
		zohoResponse = event.detail;

		if (zohoResponse.code == 'error') {
			return
		} 

		if (zohoResponse.trigger == 'blueprint') {
			ZOHO.CRM.BLUEPRINT.proceed();
		}
	}

	function zohoReady (event) {
		if (event.detail.trigger === 'blueprint') {
			zohoContext = 'blueprint';
		}
	}

</script>

<svelte:head>
	<script defer async
		src="https://maps.googleapis.com/maps/api/js?key={mapsAPIKey}&callback=initMap&libraries=places&v=weekly">
	</script>
</svelte:head>

<style>

	.widget-container {
		max-width: 1110px;
		display: flex;
		height: 100vh;
	}

	.column {
		
	}

	.column-left {
		width: 45%;
		padding: 40px 40px 20px 40px;
	}

	.column-right {
		width: 55%;
	}
	
</style>

{#if mapsReady}
<div class="widget-container">
	<div class="column column-left">
		<Form />
	</div>
	<div class="column column-right">
			<Map bind:this={map} />
	</div>
</div>
{/if}



			


