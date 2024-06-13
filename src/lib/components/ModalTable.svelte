<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { Trash2 } from 'lucide-svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let tableArr = [
		{ firstName: 'Mikhaela', lastName: 'Tapia', alias: 'Kae' },
		{ firstName: 'Alquen', lastName: 'Sarmiento', alias: 'Alquen' },
		{ firstName: 'Angelo', lastName: 'Convento', alias: 'Gelo' }
	];

	// removeRow function not persistent
	function removeRow(index: number) {
		tableArr = tableArr.filter((_, i) => i !== index);
	}
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->

		<!-- Responsive Container (recommended) -->
		<div class="table-container">
			<!-- Native Table Element -->
			<table class="table table-hover">
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Alias</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#each tableArr as row, i}
						<tr>
							<td>{row.firstName}</td>
							<td>{row.lastName}</td>
							<td>{row.alias}</td>
							<td><button on:click={() => removeRow(i)}><Trash2 /></button></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
		</footer>
	</div>
{/if}
