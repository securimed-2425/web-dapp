<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { db, user, username, trustorToView } from '$lib/gun-setup';

	initializeStores();
	let trustorToAdd: string;
	let _trustors: { [key: string]: any } = {};
	let adding: boolean = false;

	user.get( 'securimed' ).get('pr' ).map().on( ( pk: string ) => {
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

		_trustors[alias] = {firstname: firstname ?? alias, lastname, pub: pk};
		console.log( '_trustors', )
		console.log( 'list pk', pk );
	} );

	const addTrustor = () => {
		adding = true;
		const datetime = new Date().valueOf();
		const data: { [key: number]: string } = {};
		data[datetime] = trustorToAdd;
		user.get( 'securimed' ).get('pr').put( data ).then( () => {
			// TODO: check if has access (refer to SEA API in GUN DOCS)
			console.log( 'trustor added' );
			trustorToAdd = '';
			adding = false;
		});
	}

	const setTrustor = ( alias: string, pk: string ) => {
		trustorToView.set( {alias: alias, pub: pk} );
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
					<tr class="text-center">
						<td class="align-middle">{trustor[1].lastname}</td>
						<td class="align-middle">{trustor[1].firstname}</td>
						<td>
							<a href="/{$username}/trustors/{trustor[0]}" type="button" on:click={ () => setTrustor( trustor[0], trustor[1].pub ) } class="btn btn-sm variant-filled">View Records</a>
						</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{:else}
		<p class="h6">Loading...</p>
		{/if}
	</div>
</div>
