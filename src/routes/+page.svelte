<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { apiUrl } from "$lib/api"; // <-- helper for global API base

  let page_content = null;
  let loading = true;
  let error = null;

  // reactive route param
  $: page_name = $page.params.page_name;

  import JokeSum from "$lib/components/Joke-Random.svelte";
  import LatestJournalEntry from "$lib/components/Latest_Journal_Entry.svelte";
  import ZKillboardDeath from "$lib/components/ZKillboard_Death.svelte";
  import Insult from "$lib/components/Insult.svelte";

  // helper: group paragraphs by block_id
  function groupByBlock(paragraphs) {
    const groups = {};
    for (const p of paragraphs) {
      if (!groups[p.block_id]) groups[p.block_id] = [];
      groups[p.block_id].push(p.paragraph);
    }
    // convert to array sorted by block_id
    return Object.entries(groups)
                 .sort(([a], [b]) => a - b)
                 .map(([block_id, paras]) => ({ block_id, paras }));
  }

  onMount(async () => {
    loading = true;
    error = null;
    page_content = null;

    try {
      const res = await fetch(apiUrl(`/page-content/home`));
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      page_content = await res.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{page_content ? page_content.display_name : "Loading..."}</title>
  <meta name="description" content="Dynamic page content from the database" />
</svelte:head>

<div class="table-container">
  {#if loading}
    <p>Loading page: {page_name}...</p>

  {:else if error}
    <div class="p-bubble parent-bubble">
      <p class="p-bubble child-bubble" style="color:red;">
        {#if error.includes("404") || error.toLowerCase().includes("not found")}
          If the page called <i>'{page_name}'</i> was here before, it's not anymore.<br />
            <!-- ERROR: {error} -->
        {:else}
          Error: {error}
        {/if}
      </p>
    </div>

  {:else if page_content}
    <h2>{page_content.display_name}</h2>

    {#each groupByBlock(page_content.paragraphs) as block}
      <div class="p-bubble parent-bubble">
        {#each block.paras as para, i}
          <!-- render HTML content safely -->
          <p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">{@html para}</p>
        {/each}
      </div>
    {/each}

  {:else}
    <p>No page content found for page called {page_name}.</p>
  {/if}
</div>

<!-- <JokeSum /> -->
<Insult />
<LatestJournalEntry />
<ZKillboardDeath d={4 * 60 * 60 * 1000} /> <!-- refresh every 4 hours -->