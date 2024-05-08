<script lang="ts">
	import type { PatientInfo, PatientRecords } from '$lib/firebase';
	import { userData, patientData, getPatientRecords } from '$lib/firebase';
	import {
		initializeStores,
		Paginator,
		Table,
		type PaginationSettings
	} from '@skeletonlabs/skeleton';

	initializeStores();
	let records: PatientRecords;
	let patient: PatientInfo | null = null;
	let source: any[][] = [];
	let paginationSettings = {
		page: 0,
		limit: 5,
		size: source.length,
		amounts: [1, 2, 5, 10]
	} satisfies PaginationSettings;

	patientData.subscribe(async (data) => {
		if (data) {
			patient = data;
			await getPatientRecords(data).then((_records) => {
				records = _records;
				source = records['heart-rate'].map((record) => {
					return [
						record.timestamp.toLocaleDateString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						}),
						record.timestamp.toLocaleTimeString(),
						record.heartRate
					];
				});

				paginationSettings = {
					page: 0,
					limit: 5,
					size: source.length,
					amounts: [1, 2, 5, 10]
				} satisfies PaginationSettings;
			});
			// console.table(source);
		}
	});

	let tableHeaders: string[] = ['Date', 'Time', 'Heart Rate'];
	$: paginatedSource = source.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
</script>

<div class="container h-full mx-auto flex justify-start items-start">
	<div class="space-y-5 w-full">
		<a type="button" href="/{$userData?.id}/patients">
			<i class="fas fa-arrow-left"></i> Back
		</a>
		<h2 class="h2">
			Patient Info: {#if patient}{patient?.firstname} {patient?.lastname}{/if}
		</h2>
		{#if records}
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
