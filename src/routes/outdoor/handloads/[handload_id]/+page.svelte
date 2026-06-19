<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { resolve } from "$app/paths";
  import { apiRequest } from "$lib/api"; // <-- helper with auth

  let handload: any = null;
  let loading = true;
  let error: string | null = null;

  //loading spinner
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { fade } from "svelte/transition";

  // route param
  $: handload_id = $page.params.handload_id;

  onMount(async () => {
    loading = true;
    error = null;

    try {
      // 🔧 simulate work (0.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 500));

      handload = await apiRequest(`/handload/${handload_id}`);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load handload";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Handload Details</title>
  <meta name="description" content="Detailed info about a single handload" />
</svelte:head>

{#if loading}
  <div in:fade class="p-bubble parent-bubble spinner-container">
    <LoadingSpinner size={92} thickness={18} />
    <h2>Fetching data from database....</h2>
  </div>
{:else if error}
  <p style="color:red;">Error: {error}</p>
{:else if handload}
  <div class="table-container">
    <table>
      <tbody>
        <tr>
          <th colspan="2" style="text-align:center; background:#d2b48c;">
            <a href={resolve(`/pages/toolbox/handload/edit/${handload.id}`)} style="color: #000; text-decoration: underline;">
              Handload {handload.id} Details
            </a>
          </th>
        </tr>

        <tr>
          <th>Caliber</th>
          <td>{handload.caliber}</td>
        </tr>

        <tr>
          <th>Bullet</th>
          <td>
            {handload.bullet_name
              ? `${handload.bullet_name} (${handload.bullet_weight} gr)`
              : `${handload.bullet_weight} gr`}
          </td>
        </tr>

        <tr>
          <th>COAL</th>
          <td>{handload.coal}</td>
        </tr>

        <tr>
          <th>Powder</th>
          <td>{handload.powder_name}</td>
        </tr>

        <tr>
          <th>Powder Charge</th>
          <td>{handload.powder_charge} gr</td>
        </tr>

        <tr>
          <th>FPS (Avg)</th>
          <td>{handload.fps_avg}</td>
        </tr>

        <tr>
          <th>FPS SD</th>
          <td>{handload.fps_sd}</td>
        </tr>

        <tr>
          <th>FPS ES</th>
          <td>{handload.fps_es}</td>
        </tr>

        <tr>
          <th>OCW Load</th>
          <td>{handload.is_ocw ? "Yes" : "No"}</td>
        </tr>

        {#if handload.path_to_grt}
          <tr>
            <th>Path to GRT</th>
            <td
              ><a
                href={handload.path_to_grt}
                title="path to grt"
                target="_blank">HERE</a
              ></td
            >
          </tr>
        {/if}

        <!-- <tr>
        <th>Created</th>
        <td>
          {handload.created_at
            ? new Date(handload.created_at).toLocaleString()
            : "—"}
        </td>
      </tr> -->

        {#if handload.firearm}
          <tr>
            <th colspan="2" style="text-align:center; background:#d2b48c;">
              <a href={resolve(`/pages/toolbox/firearm/edit/${handload.firearm.id}`)} style="color: #000; text-decoration: underline;">
                Firearm {handload.firearm.id} Details
              </a>
            </th>
          </tr>

          <tr>
            <th>Make</th>
            <td>{handload.firearm.make}</td>
          </tr>

          <tr>
            <th>Model</th>
            <td>{handload.firearm.model}</td>
          </tr>

          <tr>
            <th>Barrel Length</th>
            <td>{handload.firearm.barrel_length}"</td>
          </tr>

          <tr>
            <th>Twist Rate</th>
            <td>1:{handload.firearm.twist}</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
{:else}
  <p>No handload found for ID {handload_id}</p>
{/if}

<style>
  /* similar table styling as main page */
  .table-container {
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  table {
    border-collapse: collapse;
    margin: 1rem auto;
    font-size: 0.9rem;
  }
  th,
  td {
    border: 1px solid #ccc;
    padding: 0.6rem 1rem;
    text-align: left;
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
