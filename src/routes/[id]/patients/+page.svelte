<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<div class="container h-full mx-auto flex justify-start items-start">
	<div class="space-y-5 w-full">
		<h2 class="h2">Patients </h2>
		<!-- {#if patients.length !== 0}
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
					{#each patients as patient}
					<tr class="text-center">
						<td class="align-middle">{patient.lastname}</td>
						<td class="align-middle">{patient.firstname}</td>
						<td>
							<a href="/{$userData?.id}/patients/{patient.id}" on:click={() => viewRecords(patient)} type="button" class="btn btn-sm variant-filled">View Records</a>
						</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{:else}
		<p class="h6">Loading...</p>
		{/if} -->
	</div>
</div>
