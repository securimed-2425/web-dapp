<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { db, user, username, trustorToView, getUserEPub } from '$lib/gun-setup';
	import SEA from 'gun/sea';

	initializeStores();
	let trustorToAdd: string;
	let _trustors: { [key: string]: any } = {};
	let adding: boolean = false;

	user.get( 'securimed' ).get('tre' ).map().on( async ( data: string ) => {
		const dec = await SEA.decrypt( data, user._.sea );
		const trustee = dec;
		const { pubkey: pk, roomkey } = trustee;

		let alias : string = '';
		let firstname : string = '';
		let lastname : string = '';
		db.user(pk).get( 'alias' ).on( ( data: string ) => {
			alias = data;
			console.log( 'list alias', alias );
		})
		db.user(pk).get('securimed').get('profile').on( ( data: any ) => {
			if ( data.firstname ) {
				firstname = data.firstname;
			}
			if ( data.lastname ) {
				lastname = data.lastname;
			}
		})

		_trustors[alias] = {firstname: firstname ?? alias, lastname, pub: pk, roomkey: roomkey};
		console.log( '_trustors', )
		console.log( 'list roomkey', roomkey );
	} );

	const addTrustor = async () => {
		adding = true;
		user.get( 'securimed' ).get( 'tre' ).get( trustorToAdd ).then( ( data: any ) => {
			if ( data ) {
				// TODO: create toast
				console.log( 'already added' );
				adding = false;
				return;
			}
		});
		const trustorEPub = getUserEPub( trustorToAdd );
		console.log( 'trustorEPub', trustorEPub );
		const secret : string  = await SEA.secret( trustorEPub, user._.sea ) || '';
		if ( !secret ) {
			// TODO: create toast
			// toastCreate( 'Trustee not found!' );
			console.log( 'Trustor not found!' );
			adding = false;
			return;
		}

		db.user( trustorToAdd ).get( 'securimed' ).get( 'trs' ).get( user._.sea.pub ).then( async ( encrypted_roomkey: string ) => {
			if ( encrypted_roomkey ) {
				console.log( 'is a trustee' );
				const roomkey = await SEA.decrypt( encrypted_roomkey, secret );
				const value = { pubkey: trustorToAdd, roomkey: roomkey };
				const stringified = JSON.stringify( value );
				const encrypted_trustor = await SEA.encrypt( stringified, user._.sea );
				const datetime = new Date().valueOf();
				const data: { [key: number]: string } = {};
				data[datetime] = encrypted_trustor;
				user.get( 'securimed' ).get( 'tre' ).put( data ).then( () => {
					// TODO: create toast
					console.log( 'trustor added' );
					trustorToAdd = '';
					adding = false;
				});
			} else {
				// TODO: create toast
				console.log( 'is not a trustee' );
				adding = false;
			}
		});
	}

	const setTrustor = ( alias: string, pk: string, roomkey: string ) => {
		trustorToView.set( {alias: alias, pub: pk, roomkey: roomkey} );
	}

	$: trustors = Object.entries(_trustors).sort(( a: any, b: any ) => a[0] - b[0] );
	console.log( 'trustors', _trustors );
</script>

<div class="container h-full mx-auto flex justify-start items-start">
	<div class="space-y-5 w-full">
		<h2 class="h2 pb-4 border-b border-b-white-200"> Trustor </h2>
				<label class="label my-4">
					<span>Add Public Key of Trustor to View Records</span>
					<div class="flex row gap-8">
						<input class="input" type="text" placeholder="Public Key" bind:value={trustorToAdd} />
						{#if adding}
							<p class="h6">Adding...</p>
						{:else}
							<button class="btn variant-filled-secondary"  on:click={ addTrustor } > Add Trustor </button>
						{/if}
					</div>
				</label>
		{#if trustors && trustors.length !== 0}
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr class="text-center">
						<th class="h5">Last Name</th>
						<th class="h5">First Name</th>
						<th class="h5">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each trustors as trustor}
					{#if trustor[0] !== 'undefined' || trustor[0] !== null || trustor[0] !== ''}
						<tr class="text-center">
							<td class="align-middle">{trustor[1].lastname}</td>
							<td class="align-middle">{trustor[1].firstname}</td>
							<td>
								<a href="/{$username}/trustors/{trustor[0]}" type="button" on:click={ () => setTrustor( trustor[0], trustor[1].pub, trustor[1].roomkey ) } class="btn btn-sm variant-filled">View Records</a>
							</td>
						</tr>
					{/if}
					{/each}
				</tbody>
			</table>
		</div>
		{:else}
		<p class="h6">Loading...</p>
		{/if}
	</div>
</div>
