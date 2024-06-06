<script lang="ts">
	import { initializeStores, Toast, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { user } from '$lib/gun-setup';
	import SEA from 'gun/sea';

	// export let data: PageData;

	initializeStores();

	const toastStore = getToastStore();
	let toastId = '';

	const toastCreate = ( message: string ) => {
		const t: ToastSettings = {
			message: message,
			background: 'variant-filled-success',
			hideDismiss: true,
			timeout: 3000
		};
		toastId = toastStore.trigger(t);
	}

	const closeToast = () => {
		toastStore.close(toastId);
	}

	let store : {[key: number]: number} = {};
	let hr : number;
	let firstname: string;
	let lastname: string;
	let saving: boolean = false;
	let adding: boolean = false;
	let peers: { [key: number]: string } = {};
	let peerToAdd: string;
	
	user.get( 'securimed' ).get('profile').on( ( data: any, key: string ) => {
		firstname = data.firstname || '';
		lastname = data.lastname || '';

		// console.log( 'securimed', data, key );
	} );
	user.get( 'securimed' ).get('rx').get('hr').map().on( ( data: number, key: number ) => {
		store[key] = data;
		// console.log( 'data', key, data );
	} );
	user.get( 'securimed' ).get('ac').map().on( ( data: string, key: number ) => {
		peers[key] = data;
		// console.log( 'peers', key, data );
	} );


	// const add = () => {
	// 	const datetime = new Date().valueOf();
	// 	const data : {[key: number]: number}= {};
	// 	data[datetime] = hr;
	// 	user.get('securimed').get('rx').get('hr').put(data);
	// }

	const updateFirstName = () => {
		saving = true;
		user.get( 'securimed' ).get('profile').get('firstname').put( firstname ).then( () => {
			toastCreate( 'First name updated!' );
			saving = false;
		});
	}

	const updateLastName = () => {
		saving = true;
		user.get( 'securimed' ).get('profile').get('lastname').put( lastname ).then( () => {
			toastCreate( 'Last name updated!' );
			saving = false;
		});
	}

	const addPeer = () => {
		adding = true;
		const datetime = new Date().valueOf();
		const data: { [key: number]: string } = {};
		data[datetime] = peerToAdd;
		user.get( 'securimed' ).get('ac').put( data ).then( () => {
			toastCreate( 'Peer granted access!' );
			adding = false;
		});
	}

	$: heartrates = Object.entries(store).sort(( a: any, b: any ) => a[0] - b[0] );
	$: _peers = Object.entries(peers).sort(( a: any, b: any ) => a[0] - b[0] );
	
</script>

<Toast />

<div class="container h-full mx-auto flex justify-start items-start">
	<div class="space-y-5">
		<h2 class="h2">Settings</h2>
		<div>
			<h3 class="h3">Profile</h3>
			{#if saving}
			<p class="h6">Saving...</p>
			{/if}
			<div class="ml-8 flex row gap-12">
				<label class="label my-4">
					<span>First Name</span>
					<input class="input" type="text" placeholder="first name" bind:value={firstname} on:blur={updateFirstName}/>
				</label>
				<label class="label my-4">
					<span>Last Name</span>
					<input class="input" type="text" placeholder="last name" bind:value={lastname} on:blur={updateLastName}/>
				</label>
			</div>
			<h3 class="h3">Trusted Peers</h3>
			<div class="ml-8 my-4">
				<div class="flex row gap-4 items-center pb-4 border-b border-b-white-200">
					<p> View Trusted Peers with access to your health records: </p>
					<!-- TODO: Add onclick function to view peers' public key with option to remove -->
					<button class="btn variant-filled-secondary" on:click={ () => console.log( 'peers', _peers ) } > View </button>
					
				</div>
				<label class="label my-4">
					<span>Add Public Key of Peer to Grant Access</span>
					<input class="input" type="text" placeholder="Public Key" bind:value={peerToAdd} on:blur={updateFirstName}/>
				</label>
				{#if adding}
					<p class="h6">Adding...</p>
				{:else}
					<button class="btn variant-filled-secondary" on:click={ addPeer } > Add </button>
				{/if}
			</div>
			
			
			<!-- <label class="label">
				<span>HR</span>
				<input class="input" type="number" placeholder="first name" name="hr" bind:value={hr}/>
			</label> -->
			<!-- <button class="btn variant-filled-secondary mx-4" on:click={ add } > Add </button>
			<h3>Heartrates</h3>
			{#each heartrates as [key, value]}
			<div>{key} : {value}</div>
			{/each} -->
			
					
		</div>
		
	</div>
</div>