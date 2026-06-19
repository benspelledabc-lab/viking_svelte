<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { resolve } from "$app/paths";
  import { apiRequest } from "$lib/api";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { fade } from "svelte/transition";

  let handload: any = null;
  let loading = true;
  let error: string | null = null;
  let dopeEntries: Array<{ distance: string; adjustment: number }> = [];

  $: handload_id = $page.params.handload_id;

  onMount(async () => {
    loading = true;
    error = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      handload = await apiRequest(`/handload/${handload_id}`);
      
      console.log('DOPE page - handload:', handload);
      console.log('DOPE page - dope_data:', handload.dope_data);
      
      // Parse DOPE data into sorted array
      if (handload.dope_data) {
        let dopeObj = handload.dope_data;
        
        // Handle if it's a string (parse it)
        if (typeof dopeObj === 'string') {
          try {
            dopeObj = JSON.parse(dopeObj);
            console.log('Parsed DOPE data from string:', dopeObj);
          } catch (e) {
            console.error('Failed to parse DOPE data:', e);
            dopeObj = null;
          }
        }
        
        // Convert to array and sort
        if (dopeObj && typeof dopeObj === 'object') {
          dopeEntries = Object.entries(dopeObj)
            .map(([distance, adjustment]) => ({
              distance,
              adjustment: Number(adjustment)
            }))
            .sort((a, b) => Number(a.distance) - Number(b.distance));
          
          console.log('DOPE entries:', dopeEntries);
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load handload";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>DOPE Data - Handload {handload_id}</title>
  <meta name="description" content="DOPE ballistic data for handload" />
</svelte:head>

{#if loading}
  <div in:fade class="p-bubble parent-bubble spinner-container">
    <LoadingSpinner size={92} thickness={18} />
    <h2>Loading DOPE data...</h2>
  </div>
{:else if error}
  <p style="color:red;">Error: {error}</p>
{:else if handload}
  <div class="dope-container">
    <div class="header-section">
      <h1>DOPE Data</h1>
      <p class="subtitle">Data On Previous Engagements</p>
      
      <div class="load-info">
        <h2>
          <a href={resolve(`/outdoor/handloads/${handload.id}`)} class="back-link">
            ← Handload {handload.id}
          </a>
        </h2>
        <p>
          <strong>{handload.caliber}</strong> • 
          {handload.bullet_name ? `${handload.bullet_name}, ` : ''}{handload.bullet_weight} gr • 
          {handload.powder_name} {handload.powder_charge} gr
        </p>
        <p><strong>Velocity:</strong> {handload.fps_avg} fps (SD: {handload.fps_sd})</p>
      </div>
    </div>

    {#if dopeEntries.length > 0}
      <div class="table-container">
        <table class="dope-table">
          <thead>
            <tr>
              <th>Distance (yards)</th>
              <th>Adjustment</th>
            </tr>
          </thead>
          <tbody>
            {#each dopeEntries as entry}
              <tr>
                <td class="distance">{entry.distance} yds</td>
                <td class="adjustment">{entry.adjustment.toFixed(1)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="info-box">
        <h3>📊 DOPE Chart Summary</h3>
        <ul>
          <li><strong>Range:</strong> {dopeEntries[0].distance} - {dopeEntries[dopeEntries.length - 1].distance} yards</li>
          <li><strong>Data Points:</strong> {dopeEntries.length}</li>
          <li><strong>Total Drop:</strong> {dopeEntries[dopeEntries.length - 1].adjustment.toFixed(1)} (from zero)</li>
        </ul>
      </div>

      {#if handload.firearm}
        <div class="firearm-info">
          <h3>Firearm Configuration</h3>
          <p>
            <strong>{handload.firearm.make} {handload.firearm.model}</strong><br />
            {handload.firearm.barrel_length}" barrel, 1:{handload.firearm.twist} twist
          </p>
        </div>
      {/if}
    {:else}
      <div class="no-data">
        <p>No DOPE data recorded for this handload yet.</p>
        <p class="hint">
          Add DOPE data by editing the handload and including distance/adjustment values.
        </p>
      </div>
    {/if}
  </div>
{:else}
  <p>No handload found for ID {handload_id}</p>
{/if}

<style>
  .dope-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .header-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    color: #2c3e50;
  }

  .subtitle {
    font-style: italic;
    color: #7f8c8d;
    margin: 0.5rem 0 1.5rem 0;
  }

  .load-info {
    background: #f8f9fa;
    border: 2px solid #d2b48c;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
  }

  .load-info h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.3rem;
  }

  .load-info p {
    margin: 0.3rem 0;
    color: #2c3e50;
  }

  .back-link {
    color: #2c3e50;
    text-decoration: none;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .table-container {
    width: 100%;
    margin: 2rem auto;
    overflow-x: auto;
  }

  .dope-table {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .dope-table thead tr {
    background-color: #d2b48c;
    color: #000;
  }

  .dope-table th {
    padding: 1rem;
    text-align: center;
    font-weight: bold;
    border: 1px solid #ccc;
  }

  .dope-table td {
    padding: 0.8rem 1rem;
    border: 1px solid #ccc;
    text-align: center;
  }

  .dope-table tbody tr:nth-child(even) {
    background-color: #e1dede;
  }

  .dope-table tbody tr:nth-child(odd) {
    background-color: #fff;
  }

  .dope-table tbody tr:hover {
    background-color: #f0e6d6;
    cursor: default;
  }

  .distance {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .adjustment {
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    color: #c0392b;
    font-weight: bold;
  }

  .info-box {
    background: #e8f4f8;
    border: 2px solid #3498db;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .info-box h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  .info-box ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .info-box li {
    padding: 0.4rem 0;
    color: #2c3e50;
  }

  .firearm-info {
    background: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    text-align: center;
  }

  .firearm-info h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  .firearm-info p {
    margin: 0;
    color: #2c3e50;
    line-height: 1.6;
  }

  .no-data {
    text-align: center;
    padding: 3rem 1rem;
    background: #f8f9fa;
    border: 2px dashed #ccc;
    border-radius: 8px;
    margin: 2rem 0;
  }

  .no-data p {
    margin: 0.5rem 0;
    color: #6c757d;
  }

  .hint {
    font-style: italic;
    font-size: 0.9rem;
  }

  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 2rem;
    }

    .dope-table {
      font-size: 0.9rem;
    }

    .dope-table th,
    .dope-table td {
      padding: 0.6rem;
    }
  }
</style>
