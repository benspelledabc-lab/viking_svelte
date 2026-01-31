<style>
  .bubble-table {
    padding: 1rem;
    margin: 1rem auto;
    border-radius: 1rem;
    background-color: #f7f3f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  .table-container {
    width: 100%;
    text-align: center;
  }
  table {
    border-collapse: collapse;
    font-size: 0.95rem;
    width: 100%;
    table-layout: auto;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 0.4rem 0.7rem;
    text-align: left;
    position: relative;
  }
  thead tr {
    background-color: #d2b48c;
    color: #000;
  }
  tbody tr:nth-child(even) {
    background-color: #e1dede;
  }
  tbody tr:nth-child(odd) {
    background-color: #fff;
  }
  tbody tr:hover {
    background-color: #f0e6d6;
  }
</style>
<script lang="ts">
  import { onMount } from "svelte";
  import { apiRequest } from "$lib/api";

  let history = [];
  let loading = true;
  let error: string | null = null;

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
  <title>404 History</title>
  <meta name="description" content="Sorted 404 not found history" />
</svelte:head>

{#if loading}
  <p>Loading 404 history...</p>
{:else if error}
  <p style="color: red">{error}</p>
{:else}
  <h2>404 Not Found History</h2>
  <div class="p-bubble parent-bubble bubble-table">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Last Seen</th>
            <th>Path</th>            
            <th>Total Hit Count</th>
            <th>Last IP</th>
          </tr>
        </thead>
        <tbody>
          {#each history as row}
            <tr>
              <td>{row.last_seen}</td>
              <td>{row.requested_url}</td>              
              <td>{row.total_hit_count}</td>
              <td>{row.last_ip}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}
