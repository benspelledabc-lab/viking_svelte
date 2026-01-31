<script lang="ts">
  import { onMount } from "svelte";
  import { apiRequest } from "$lib/api";

  let history = [];
  let loading = true;
  let error: string | null = null;
  import Top404s from '$lib/components/Top404s.svelte';

  onMount(async () => {
    try {
      history = await apiRequest("/not_found_logs/history");
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load 404 history";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>404 History Example</title>
  <meta name="description" content="Example: Sorted 404 not found history" />
</svelte:head>

<h2>El Plugin</h2>
  <div class="p-bubble parent-bubble">    
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      <Top404s count={10} />
    </p> 
  </div>  
