<script>
  import { onMount } from "svelte";

  let handloads = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const res = await fetch("http://viking.spelledabc.org:5000/api/v1/handloads");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      handloads = await res.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading handloads...</p>
{:else if error}
  <p style="color:red">{error}</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Caliber</th>
        <th>Bullet</th>
        <th>Powder</th>
        <th>Primer</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      {#each handloads as h}
        <tr>
          <td>{h.id}</td>
          <td>{h.caliber}</td>
          <td>{h.bullet}</td>
          <td>{h.powder}</td>
          <td>{h.primer}</td>
          <td>{h.notes}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
