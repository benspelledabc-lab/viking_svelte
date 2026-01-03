<script>
  import { onMount } from "svelte";

  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl } from "$lib/api"; // <-- helper for global API base

  // Helper: group paragraphs by block_id
  function groupByBlock(paragraphs) {
    const groups = {};
    for (const p of paragraphs) {
      if (!groups[p.block_id]) groups[p.block_id] = [];
      groups[p.block_id].push(p.paragraph);
    }
    return Object.entries(groups).map(([block_id, paras]) => ({
      block_id,
      paras,
    }));
  }

  let groupedParagraphs = [];

  onMount(async () => {
    try {
      // import { apiUrl } from "$lib/api"; // <-- helper for global API base
      const res = await fetch(apiUrl(`/page-content/page_help`));
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      page = await res.json();

      // Group paragraphs by block_id
      groupedParagraphs = groupByBlock(page.paragraphs);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="table-container">
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p style="color:red;">{error}</p>
  {:else if page}
    <h2>{page.display_name}</h2>

    {#each groupedParagraphs as block}
      <div class="p-bubble parent-bubble">
        {#each block.paras as para, i}
          <!-- dont auto escape the html -->
          <p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">
            {@html para}
          </p>
        {/each}
      </div>
    {/each}
  {:else}
    <p>No page content found.</p>
  {/if}
</div>
