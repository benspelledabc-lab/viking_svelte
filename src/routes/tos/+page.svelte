<script lang="ts">
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl } from "$lib/api"; // <-- helper for global API base

  import { onMount } from "svelte";

  // Dynamic content
  let content: { paragraphs: string[] } | null = null;

  onMount(async () => {
    try {
      const res = await fetch("/tos.json");
      if (res.ok) {
        content = await res.json();
      }
    } catch (err) {
      console.error(err);
    }
  });
</script>

<selection>
  {#if content}
    <!-- <h2>Svelte is pimptastic... ish.</h2> -->
    <h2>{content.title}</h2>

    <!-- Parent bubble wrapping all paragraphs -->
    <div class="p-bubble parent-bubble">
      {#each content.paragraphs as paragraph, i}
        <p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">
          <!-- Parsed as HTML -->
          {@html paragraph}
        </p>
      {/each}
    </div>
  {:else}
    <div class="table-container">
      <h2>Static TOS Page Header</h2>
      <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          Blah blah blah.. TOS stuff.
        </p>
      </div>
    </div>
  {/if}
</selection>
