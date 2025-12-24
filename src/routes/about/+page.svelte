<script lang="ts">
	import { onMount } from 'svelte';

	let content: { title: string; paragraphs: string[] } | null = null;

	onMount(async () => {
		const res = await fetch('/about.json');
		content = await res.json();
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
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
