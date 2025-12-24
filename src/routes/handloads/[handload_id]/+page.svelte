<svelte:head>
  <title>Handload Details</title>
  <meta name="description" content="Detailed info about a single handload" />
</svelte:head>

<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let handload = null;
  let loading = true;
  let error = null;

  // route param
  $: handload_id = $page.params.handload_id;

  onMount(async () => {
    loading = true;
    error = null;

    try {
      const res = await fetch(`https://api.spelledabc.org/api/v1/handload/${handload_id}`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      handload = await res.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<style>
  /* similar table styling as main page */
  .table-container { width: 100%; margin: 0 auto; text-align: center; }
  table { border-collapse: collapse; margin: 1rem auto; font-size: 0.9rem; }
  th, td { border: 1px solid #ccc; padding: 0.6rem 1rem; text-align: left; }
  thead tr { background-color: #d2b48c; color: #000; }
  tbody tr:nth-child(even) { background-color: #e1dede; }
  tbody tr:nth-child(odd) { background-color: #fff; }
  tbody tr:hover { background-color: #f0e6d6; }
</style>

{#if loading}
  <p>Loading handload #{handload_id}...</p>
{:else if error}
  <p style="color:red;">Error: {error}</p>
{:else if handload}
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Handload ID</th>
          <th>Is OCW</th>
          <th>Caliber</th>
          <th>Make</th>
          <th>Model</th>
          <th>Barrel Length</th>
          <th>Twist Rate</th>
          <th>Powder Name</th>
          <th>Powder Charge</th>
          <th>FPS_AVG</th>
          <th>FPS_SD</th>
          <th>FPS_ES</th>
          <th>COAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{handload.id}</td>
          <td>{handload.is_ocw}</td>
          <td>{handload.caliber}</td>
          <td>{handload.firearm?.make}</td>
          <td>{handload.firearm?.model}</td>
          <td>{handload.firearm?.barrel_length}</td>
          <td>{handload.firearm?.twist}</td>
          <td>{handload.powder_name}</td>
          <td>{handload.powder_charge}</td>
          <td>{handload.fps_avg}</td>
          <td>{handload.fps_sd}</td>
          <td>{handload.fps_es}</td>
          <td>{handload.coal}</td>
        </tr>
      </tbody>
    </table>
  </div>
{:else}
  <p>No handload found for ID {handload_id}</p>
{/if}
