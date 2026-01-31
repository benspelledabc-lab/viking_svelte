<script lang="ts">
  import { onMount } from "svelte";
  import { apiRequest } from "$lib/api";

  export let count: number = 3;
  let top404 = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const history = await apiRequest("/not_found_logs/history");
      top404 = history.slice(0, count);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load 404 history";
    } finally {
      loading = false;
    }
  });
</script>

<div class="top404-container">
  <h3>Most Recent 404s</h3>
  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p style="color: red">{error}</p>
  {:else if top404.length === 0}
    <p>No recent 404s found.</p>
  {:else}
    <ul>
      {#each top404 as row}
        <li>
            <span class="date">{row.last_seen}</span>
            <!-- <strong>URL: {row.requested_url}</strong> -->
            <span class="url">URL: {row.requested_url}</span>
            <span class="count">Lifetime Hits: {row.total_hit_count}</span>
            <span class="last_ip">Last IP: {row.last_ip}</span>
        </li>

      {/each}
    </ul>
  {/if}
</div>

<style>
  .top404-container {
    margin: 1em 0;
    padding: 1em;
    background: #f7f3f0;
    border-radius: 0.7em;
    box-shadow: 0 2px 6px rgba(0,0,0,0.10);
    max-width: 400px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 0.7em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-direction: column;
  }
  .date {
    font-weight: bolder;
    font-size: 0.85em;
    color: #888;
  }
  .count {
    font-size: 0.85em;
    color: #b36b00;
  }
  .url {
    font-size: 0.85em;
    color: #007acc;
  }
  .last_ip {
    font-size: 0.85em;
    color: #555;
  }
</style>