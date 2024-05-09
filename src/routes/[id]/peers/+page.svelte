<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';
	import { db, user, username, peerToView } from '$lib/gun-setup';

	initializeStores();
	let peerToAdd: string;
	let _peers: { [key: string]: any } = {};
	let adding: boolean = false;

	user.get( 'securimed' ).get('pr' ).map().on( ( pk: string ) => {
		let alias : string = '';
		let firstname : string = '';
		let lastname : string = '';
		db.user(pk).get( 'alias' ).on( ( data: string ) => {
			alias = data;
		})
		db.user(pk).get('securimed').get('profile').on( ( data: any ) => {
			if ( data.firstname ) {
				firstname = data.firstname;
			}
			if ( data.lastname ) {
				lastname = data.lastname;
			}
		})

		_peers[alias] = {firstname: firstname ?? alias, lastname, pub: pk};
		console.log( 'list pk', pk );
	} );

	const addPeer = () => {
		adding = true;
		const datetime = new Date().valueOf();
		const data: { [key: number]: string } = {};
		data[datetime] = peerToAdd;
		user.get( 'securimed' ).get('pr').put( data ).then( () => {
			// TODO: check if has access (refer to SEA API in GUN DOCS)
			console.log( 'peer added' );
			peerToAdd = '';
			adding = false;
		});
	}

	const setPeer = ( alias: string, pk: string ) => {
		peerToView.set( {alias: alias, pub: pk} );
	}

	$: peers = Object.entries(_peers).sort(( a: any, b: any ) => a[0] - b[0] );
	console.log( 'peers', _peers );
</script>

<div class="container h-full mx-auto flex justify-start items-start">
	<div class="space-y-5 w-full">
		<h2 class="h2 pb-4 border-b border-b-white-200"> Peers </h2>
				<label class="label my-4">
					<span>Add Public Key of Peer to View Records</span>
					<div class="flex row gap-8">
						<input class="input" type="text" placeholder="Public Key" bind:value={peerToAdd} />
						{#if adding}
							<p class="h6">Adding...</p>
						{:else}
							<button class="btn variant-filled-secondary"  on:click={ addPeer } > Add Peer </button>
						{/if}
					</div>
				</label>
		{#if peers && peers.length !== 0}
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
					{#each peers as peer}
					<tr class="text-center">
						<td class="align-middle">{peer[1].lastname}</td>
						<td class="align-middle">{peer[1].firstname}</td>
						<td>
							<a href="/{$username}/peers/{peer[0]}" type="button" on:click={ () => setPeer( peer[0], peer[1].pub ) } class="btn btn-sm variant-filled">View Records</a>
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
