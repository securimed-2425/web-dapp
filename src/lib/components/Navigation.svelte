<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { username, user } from '$lib/gun-setup';

	const drawerStore = getDrawerStore();
	function drawerClose(): void {
		drawerStore.close();
	}

	const signOut = () => {
		user.leave();
		username.set('');
	}
</script>

{#if $username}
	<div class="p-4 flex flex-col justify-between h-full">
		<h4 class="h4 align-bottom">Good morning,<br /> Dr. {$username}</h4>
		<nav class="list-nav">
				<ul>
					<li><a class="my-4" href={`/${$username}`} on:click={drawerClose}>Dashboard</a></li>
					<li>
						<a class="my-4" href={`/${$username}/patients`} on:click={drawerClose}>Patients</a>
					</li>
					<li>
						<a class="my-4" href={`/${$username}/settings`} on:click={drawerClose}>Settings</a>
					</li>
				</ul>
		</nav>
		<a
			href="/"
			class="btn variant-filled-primary mt-auto"
			data-sveltekit-preload-data="hover"
			on:click={ signOut }
		>
			Sign Out
		</a>
	</div>
{/if}
