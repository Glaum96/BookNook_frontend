<script lang="ts">
	import { goto } from '$app/navigation'
	import { base } from '$app/paths'
	import { API_BASE_URL } from '$lib/config'
	import { addUserToLocalStorage } from '$lib/api/users'
	import { isLoading, setLoading } from '../../stores/loading'
	import Spinner from '$lib/components/spinner/Spinner.svelte'

	let name = ''
	let email = ''
	let phoneNumber = ''
	let apartmentNumber = ''
	let password = ''
	let passwordConfirm = ''
	let backendErrors: string[] = []
	let emailExists: boolean | null = null
	let checkingEmail = false

	const registerLoading = isLoading('register')

	const errorTranslations: Record<string, string> = {
		'Email address is already registered': 'E-postadressen er allerede registrert',
		'Email is required': 'E-post er påkrevd',
		'Password is required': 'Passord er påkrevd',
		'Name is required': 'Navn er påkrevd',
		'Invalid email format': 'Ugyldig e-postformat',
		'Password must be at least 8 characters': 'Passordet må være minst 8 tegn',
		'Password must be at most 128 characters': 'Passordet kan ikke være lengre enn 128 tegn',
		'Password must contain at least one uppercase letter': 'Passordet må inneholde minst én stor bokstav',
		'Password must contain at least one lowercase letter': 'Passordet må inneholde minst én liten bokstav',
		'Password must contain at least one digit': 'Passordet må inneholde minst ett tall',
		'Password must contain at least one special character': 'Passordet må inneholde minst ett spesialtegn',
	}

	function translateError(error: string): string {
		return errorTranslations[error] ?? error
	}

	$: passwordChecks = {
		minLength: password.length >= 8,
		maxLength: password.length <= 128,
		hasUppercase: /[A-Z]/.test(password),
		hasLowercase: /[a-z]/.test(password),
		hasDigit: /[0-9]/.test(password),
		hasSpecial: /[^A-Za-z0-9]/.test(password),
	}

	$: passwordValid = Object.values(passwordChecks).every(Boolean)
	$: passwordsMatch = password === passwordConfirm

	async function handleEmailBlur() {
		if (!email) return
		checkingEmail = true
		emailExists = null
		try {
			const res = await fetch(`${API_BASE_URL}/api/checkEmail?email=${encodeURIComponent(email)}`)
			emailExists = res.status === 409
		} catch {
			// ignore network errors here — backend will catch it on submit
		} finally {
			checkingEmail = false
		}
	}

	async function registerUser() {
		if (!passwordValid || !passwordsMatch || emailExists) return

		backendErrors = []
		setLoading('register', true)
		try {
			const response = await fetch(`${API_BASE_URL}/api/postUser`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, phoneNumber, apartmentNumber, password }),
			})

			if (response.ok) {
				const loginResponse = await fetch(`${API_BASE_URL}/api/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ username: email, password }),
				})
				if (loginResponse.ok) {
					const data = await loginResponse.json()
					localStorage.setItem('authToken', data.authToken)
					localStorage.setItem('userId', data.userId)
					await addUserToLocalStorage(data.userId)
					goto(`${base}/`)
				}
			} else {
				try {
					const errorData = await response.json()
					if (Array.isArray(errorData?.errors)) {
						backendErrors = errorData.errors.map(translateError)
					} else if (Array.isArray(errorData)) {
						backendErrors = errorData.map(translateError)
					} else if (typeof errorData === 'string') {
						backendErrors = [translateError(errorData)]
					} else if (errorData.message) {
						backendErrors = [translateError(errorData.message)]
					} else {
						backendErrors = ['En feil oppstod. Prøv igjen.']
					}
				} catch {
					backendErrors = ['En feil oppstod. Prøv igjen.']
				}
			}
		} catch {
			backendErrors = ['Kunne ikke koble til serveren. Prøv igjen.']
		} finally {
			setLoading('register', false)
		}
	}
</script>

<div class="register-container">
	<div class="register-card">
		<h1>Registrer deg</h1>
		<form on:submit|preventDefault={registerUser}>
			<div class="input-group">
				<label for="name">Fullt navn</label>
				<input id="name" type="text" bind:value={name} placeholder="Ola Nordmann" required disabled={$registerLoading} />
			</div>
			<div class="input-group">
				<label for="email">E-post</label>
				<input id="email" type="email" bind:value={email} on:blur={handleEmailBlur} placeholder="ola@example.com" required disabled={$registerLoading} />
				{#if checkingEmail}
					<p class="field-info">Sjekker e-post...</p>
				{:else if emailExists === true}
					<p class="field-error">E-postadressen er allerede registrert</p>
				{/if}
			</div>
			<div class="input-group">
				<label for="phoneNumber">Telefonnummer</label>
				<input id="phoneNumber" type="tel" bind:value={phoneNumber} placeholder="99887766" required disabled={$registerLoading} />
			</div>
			<div class="input-group">
				<label for="apartmentNumber">Leilighetsnummer</label>
				<input id="apartmentNumber" type="text" bind:value={apartmentNumber} placeholder="A101" required disabled={$registerLoading} />
			</div>
			<div class="input-group">
				<label for="password">Passord</label>
				<input id="password" type="password" bind:value={password} placeholder="Passord" required disabled={$registerLoading} />
				{#if password.length > 0}
					<ul class="password-requirements">
						<li class:met={passwordChecks.minLength}>Minst 8 tegn</li>
						<li class:met={passwordChecks.maxLength}>Maks 128 tegn</li>
						<li class:met={passwordChecks.hasUppercase}>Minst én stor bokstav</li>
						<li class:met={passwordChecks.hasLowercase}>Minst én liten bokstav</li>
						<li class:met={passwordChecks.hasDigit}>Minst ett tall</li>
						<li class:met={passwordChecks.hasSpecial}>Minst ett spesialtegn</li>
					</ul>
				{/if}
			</div>
			<div class="input-group">
				<label for="passwordConfirm">Bekreft passord</label>
				<input id="passwordConfirm" type="password" bind:value={passwordConfirm} placeholder="Gjenta passord" required disabled={$registerLoading} />
				{#if passwordConfirm.length > 0 && !passwordsMatch}
					<p class="field-error">Passordene stemmer ikke overens</p>
				{/if}
			</div>
			{#if backendErrors.length > 0}
				<ul class="error-list">
					{#each backendErrors as error}
						<li>{error}</li>
					{/each}
				</ul>
			{/if}
			<button type="submit" disabled={$registerLoading}>
				{#if $registerLoading}
					<Spinner size="small" inline />
					Registrerer...
				{:else}
					Registrer
				{/if}
			</button>
		</form>
		<p class="login-link">Har du allerede en konto? <a href="{base}/login">Logg inn</a></p>
	</div>
</div>

<style>
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.register-card {
		background: var(--bg-card);
		padding: 2rem;
		border-radius: 10px;
		box-shadow: 0 4px 8px var(--shadow-sm);
		max-width: 440px;
		width: 100%;
		text-align: center;
	}

	h1 {
		margin-bottom: 1.5rem;
		margin-top: 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--color-primary);
	}

	.input-group {
		margin-bottom: 1rem;
		text-align: left;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 5px;
		font-size: 1rem;
		box-sizing: border-box;
	}

	.password-requirements {
		list-style: none;
		padding: 0.5rem 0 0;
		margin: 0;
		font-size: 0.85rem;
	}

	.password-requirements li {
		color: var(--text-very-muted);
		padding: 0.1rem 0;
	}

	.password-requirements li::before {
		content: '✗ ';
		color: var(--color-error);
	}

	.password-requirements li.met {
		color: var(--color-success);
	}

	.password-requirements li.met::before {
		content: '✓ ';
		color: var(--color-success);
	}

	.field-error {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: var(--color-error);
	}

	.field-info {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.error-list {
		list-style: none;
		padding: 0.75rem 1rem;
		margin: 0 0 1rem;
		background: var(--color-error-bg);
		border: 1px solid var(--color-error-border);
		border-radius: 5px;
		text-align: left;
		color: var(--color-error);
		font-size: 0.9rem;
	}

	.error-list li + li {
		margin-top: 0.25rem;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		border: none;
		border-radius: 5px;
		background: var(--color-action);
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	button:hover {
		background: var(--color-action-hover);
	}

	.login-link {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.login-link a {
		color: var(--color-action);
		text-decoration: none;
	}

	.login-link a:hover {
		text-decoration: underline;
	}
</style>
