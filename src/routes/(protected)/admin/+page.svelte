<script lang="ts">
  import swagger from "$lib/images/viking_swagger_steampunk.png";

  import { resolve } from "$app/paths";
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl, swaggerUrl } from "$lib/api"; // <-- helper for global API base

  import { onMount } from "svelte";

  // Dynamic content
  let content: { paragraphs: string[] } | null = null;

  onMount(async () => {
    try {
      const res = await fetch("/placeholder.json");
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
      <h2>The CRUDy stuff</h2>
      <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          <a href={resolve("/admin/firearm/add")}>Add Firearm</a><br />
          <a href={resolve("/admin/handload/add")}>Add Handload</a><br />
        </p>
      </div>
    </div>

    <a href={swaggerUrl(`/swagger`)}>
      <img src={swagger} alt="Viking Swagger" width="400" height="300" />
    </a>
  {/if}
</selection>
