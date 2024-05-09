<script lang="ts">
	import {
		initializeStores,
		Paginator,
		Table,
		type PaginationSettings
	} from '@skeletonlabs/skeleton';
	import { db, user, username, peerToView } from '$lib/gun-setup';

	initializeStores();
	let source: any[][] = [];
	let paginationSettings = {
		page: 0,
		limit: 5,
		size: source.length,
		amounts: [1, 2, 5, 10]
	} satisfies PaginationSettings;

	let peer: { [key: string]: string } = {};
	let profile: { [key: string]: string } = {};

	const customSort = (a: any[], b: any[]): number => {
		const dateA = new Date(`${a[0]} ${a[1]}`).valueOf();
		const dateB = new Date(`${b[0]} ${b[1]}`).valueOf();
		return dateB - dateA;
	}

	peerToView.subscribe(async (data) => {
		if (data) {
			peer = data;
			source = [];
			db.user(peer.pub).get('securimed').get('profile').on(( _profile ) => {
				profile.firstname = _profile.firstname ?? '';
				profile.lastname = _profile.lastname ?? '';
			});
			db.user(peer.pub).get('securimed').get('rx').get('hr').map().once((heartrate: number, _key: string) => {
				// records[_key] = heartrate;
				const datetime = new Date(Number(_key));
				source.push([
					datetime.toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					}),
					datetime.toLocaleTimeString(),
					heartrate
				])

				console.table( source );
			});
		}
	});

	let tableHeaders: string[] = ['Date', 'Time', 'Heart Rate'];
	$: paginatedSource = source.sort(customSort).slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
</script>

<div class="container h-full mx-auto flex justify-start items-start">
	<div class="space-y-5 w-full">
		<a type="button" href="/{$username}/peers">
			<i class="fas fa-arrow-left"></i> Back
		</a>
		<h2 class="h2">
			Patient Info:
			 {#if profile}{profile?.firstname ?? peer.alias} {profile?.lastname}{/if}
		</h2>
		{#if source.length}
			<Table
				source={{ head: tableHeaders, body: paginatedSource }}
				regionBody="text-center"
				regionCell="align-middle"
				regionHeadCell="h6 text-center"
				element="table table-hover"
			/>
			<Paginator
				bind:sources={source}
				bind:settings={paginationSettings}
				showFirstLastButtons={false}
				showPreviousNextButtons={true}
			/>
		{:else}
			<p class="h6">Loading...</p>
		{/if}
	</div>
</div>
