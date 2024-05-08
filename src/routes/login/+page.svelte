<script lang="ts">
	import { initializeStores, Toast, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { user } from '$lib/gun-setup';
	import { goto } from '$app/navigation';

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

	let username : string;
	let password : string;

	const login = () => {
		user.auth( username, password, ( { err }: { err: string } ) => {
			if ( err ) {
				toastCreate( err )
			} else {
				goto( `/${username}` );
			}
		} );
	}

	const signup = () => {
		user.create( username, password, ( { err }: { err: string } ) => {
			if ( err ) {
				toastCreate( err );
			} else {
				// TODO - generate unique id
				login();
			}
		} );
	}

</script>

<Toast />

<div class="flex flex-col justify-start items-center mx-auto h-screen pt-20">
	<div class="flex flex-col items-center mb-10">
		<h3 class="h3 mx-auto">Welcome to</h3>
		<h1 class="h1 text-8xl mb-4">
			<span
				class="bg-gradient-to-br from-primary-500 to-tertiary-700 bg-clip-text text-transparent box-decoration-clone"
				>SecuriMed</span
			>
		</h1>
	</div>
	<label class="label mb-5">
		<span>Username</span>
		<input class="input" title="Username" type="text" placeholder="Username" name="username" bind:value={username} minlength="3" maxlength="16" required/>
	</label>
	<label class="label">
		<span>Password</span>
		<input class="input" title="Password" type="password" placeholder="Password" name="password" bind:value={password} required/>
	</label>

	<div class="row my-8">
		<button class="btn variant-filled-primary mx-4" on:click={ login } > Login </button>
		<button class="btn variant-filled-secondary mx-4" on:click={ signup } > Sign Up </button>
	</div>

</div>
