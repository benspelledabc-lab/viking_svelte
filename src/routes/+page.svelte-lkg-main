<script lang="ts">
	import { onMount } from 'svelte';

	// Dynamic content
	let content: { paragraphs: string[] } | null = null;

	onMount(async () => {
		try {
			const res = await fetch('/home.json');
			if (res.ok) {
				content = await res.json();
			}
		} catch (err) {
			console.error(err);
		}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if content}
		<!-- Parent bubble wrapping all paragraphs -->
		<div class="p-bubble parent-bubble">
			{#each content.paragraphs as paragraph, i}
				<p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">{paragraph}</p>
			{/each}
		</div>
	{:else}
		<p class="p-bubble">/static/home.json not found or no dynamic content.</p>
	{/if}
</section>