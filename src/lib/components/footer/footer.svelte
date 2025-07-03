<script lang="ts">
	import './footer.css'

	const handleFooterLinkClick = (link: string) => {
		window.open(link, '_blank');
	}
</script>

<footer>
	<button-group>
		<button title="GitHub Link for Frontend (Svelte)" on:click={() => handleFooterLinkClick('https://github.com/Glaum96/BookNook_frontend')}>
			<img src="/footer/gh_svelte_icon.svg" alt="GitHub Link for Frontend (Svelte)" />
		</button>
		<button title="GitHub Link for Backend (Spring Boot)" on:click={() => handleFooterLinkClick('https://github.com/Glaum96/BookNook_backend')} >
			<img src="/footer/gh_springboot_icon.svg" alt="GitHub Link for Backend (Spring Boot)"/>
		</button>
		<button title="LinkedIn of Author (Haakon Gunleiksrud)" on:click={() => handleFooterLinkClick('https://www.linkedin.com/in/haakogun/')} >
			<img src="/footer/linkedin.png" alt="LinkedIn of Author (Haakon Gunleiksrud)"/>
		</button>
		<button class="egg" title="Klikk meg daaaa... (du vet du vil)" on:click={() => handleFooterLinkClick('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1')} >
			<img src="/footer/egg.png" alt="Klikk og finn ut..."/>
		</button>
	</button-group>
</footer>
