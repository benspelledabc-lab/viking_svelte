<script lang="ts">
  import swagger from "$lib/images/viking_swagger_steampunk.png";

  import { resolve } from "$app/paths";
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl, swaggerUrl } from "$lib/api"; // <-- helper for global API base
  import { authStore } from "$lib/stores/auth";

  import { onMount } from "svelte";

  // Dynamic content
  let content: { title?: string; paragraphs: string[] } | null = null;

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

  // Helper function to check if user is admin or superadmin
  $: isAdminUser = $authStore.user?.role === 'admin' || $authStore.user?.role === 'superadmin';

</script>

<svelte:head>
  <title>Toolbox</title>
  <meta name="description" content="A collection of tools and utilities for managing the application." />
</svelte:head>

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
    {#if isAdminUser}
      <div class="table-container">
        <h2>The CRUDy stuff</h2>
        <div class="p-bubble parent-bubble">
          <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            <a href={resolve("/admin/handloads")}>Handload CRUD</a><br />
            <a href={resolve("/admin/firearms")}>Firearm CRUD</a><br />
            <a href={resolve("/admin/knives")}>Knife CRUD</a><br />
            <a href={resolve("/admin/vicious-mockery")}>Vicious Mockery CRUD</a><br />
            <a href={resolve("/admin/journal_entry")}>Journal Entry CRUD</a><br />
            <a href={resolve("/admin/file_uploads")}>File Uploads CRUD</a><br />
            <a href={resolve("/admin/groundhog_removals")}>Groundhog Removals CRUD</a><br />
            <a href={resolve("/admin/404-logs")}>404 Logs</a><br />
          </p>
        </div>
      </div>
    {/if}

    <a href={swaggerUrl(`/swagger`)} target="_blank" rel="noopener noreferrer">
      <img src={swagger} alt="Viking Swagger" width="400" height="300" />
    </a>
  {/if}
</selection>
