<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { resolve } from "$app/paths";
  import { apiRequest, apiUrl } from "$lib/api";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { fade } from "svelte/transition";
  import { authStore } from "$lib/stores/auth";

  let handload: any = null;
  let loading = true;
  let error: string | null = null;
  let successMessage: string | null = null;
  let dopeEntries: Array<{ distance: string; adjustment: number; editing?: boolean }> = [];
  let isEditMode = false;
  let newDistance = "";
  let newAdjustment = "";
  let saving = false;

  $: handload_id = $page.params.handload_id;
  $: isAdminUser = $authStore.user?.role === 'admin' || $authStore.user?.role === 'superadmin';

  async function loadHandload() {
    loading = true;
    error = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      handload = await apiRequest(`/handload/${handload_id}`);
      
      console.log('DOPE page - handload:', handload);
      console.log('DOPE page - dope_data:', handload.dope_data);
      
      // Parse DOPE data into sorted array
      dopeEntries = [];
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
              adjustment: Number(adjustment),
              editing: false
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
  }

  function toggleEditMode() {
    isEditMode = !isEditMode;
    if (!isEditMode) {
      // Cancel all inline edits
      dopeEntries = dopeEntries.map(e => ({ ...e, editing: false }));
      newDistance = "";
      newAdjustment = "";
    }
  }

  function addNewEntry() {
    // Check if values are provided (handle both empty strings and actual empty values)
    if (newDistance === "" || newDistance === null || newDistance === undefined) {
      error = "Please enter a distance";
      setTimeout(() => error = null, 3000);
      return;
    }
    
    if (newAdjustment === "" || newAdjustment === null || newAdjustment === undefined) {
      error = "Please enter an adjustment";
      setTimeout(() => error = null, 3000);
      return;
    }

    // Convert to proper types
    const distance = String(newDistance);
    const adjustment = parseFloat(newAdjustment);

    if (isNaN(adjustment)) {
      error = "Adjustment must be a number";
      setTimeout(() => error = null, 3000);
      return;
    }

    // Check if distance already exists
    if (dopeEntries.some(e => e.distance === distance)) {
      error = "Distance already exists. Edit the existing entry instead.";
      setTimeout(() => error = null, 3000);
      return;
    }

    dopeEntries = [...dopeEntries, { distance, adjustment, editing: false }]
      .sort((a, b) => Number(a.distance) - Number(b.distance));
    
    newDistance = "";
    newAdjustment = "";
  }

  function deleteEntry(index: number) {
    if (confirm(`Delete DOPE entry for ${dopeEntries[index].distance} yards?`)) {
      dopeEntries = dopeEntries.filter((_, i) => i !== index);
    }
  }

  async function saveChanges() {
    saving = true;
    error = null;
    successMessage = null;

    try {
      // Convert array back to object
      const dopeObj = dopeEntries.reduce((acc, entry) => {
        acc[entry.distance] = entry.adjustment;
        return acc;
      }, {} as Record<string, number>);

      const res = await fetch(apiUrl(`/handload/${handload_id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          dope_data: dopeObj
        })
      });

      if (res.ok) {
        successMessage = "DOPE data saved successfully!";
        isEditMode = false;
        await loadHandload();
        setTimeout(() => successMessage = null, 3000);
      } else {
        const errorData = await res.json();
        error = errorData.message || "Failed to save DOPE data";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to save DOPE data";
    } finally {
      saving = false;
    }
  }

  onMount(loadHandload);
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
{:else if handload}
  <div class="dope-container">
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    {#if successMessage}
      <div class="success-message">{successMessage}</div>
    {/if}

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
        <p><strong>Velocity:</strong> {handload.fps_avg} fps (ES: {handload.fps_es})</p>
      </div>

      {#if isAdminUser}
        <div class="edit-controls">
          {#if !isEditMode}
            <button class="btn-edit" on:click={toggleEditMode}>
              ✏️ Edit DOPE Data
            </button>
          {:else}
            <button class="btn-save" on:click={saveChanges} disabled={saving}>
              {saving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
            <button class="btn-cancel" on:click={toggleEditMode} disabled={saving}>
              ❌ Cancel
            </button>
          {/if}
        </div>
      {/if}
    </div>

    {#if isEditMode}
      <div class="add-entry-form">
        <h3>Add New Distance</h3>
        <div class="form-inline">
          <input 
            type="number" 
            placeholder="Distance (yds)" 
            bind:value={newDistance}
            class="input-distance"
          />
          <input 
            type="number" 
            step="0.1"
            placeholder="Adjustment (MOA/MIL)" 
            bind:value={newAdjustment}
            class="input-adjustment"
          />
          <button class="btn-add" on:click={addNewEntry}>
            ➕ Add
          </button>
        </div>
      </div>
    {/if}

    {#if dopeEntries.length > 0}
      <div class="table-container">
        <table class="dope-table">
          <thead>
            <tr>
              <th>Distance (yards)</th>
              <th>Adjustment</th>
              {#if isEditMode}
                <th>Actions</th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each dopeEntries as entry, index}
              <tr>
                <td class="distance">
                  {#if isEditMode}
                    <input 
                      type="text" 
                      bind:value={entry.distance}
                      class="input-cell"
                      readonly
                    />
                  {:else}
                    {entry.distance} yds
                    {#if entry.distance === "1760"}
                      <span class="mile-badge">1 MILE</span>
                    {/if}
                  {/if}
                </td>
                <td class="adjustment">
                  {#if isEditMode}
                    <input 
                      type="number" 
                      step="0.1"
                      bind:value={entry.adjustment}
                      class="input-cell"
                    />
                  {:else}
                    {entry.adjustment.toFixed(1)}
                  {/if}
                </td>
                {#if isEditMode}
                  <td class="actions">
                    <button class="btn-delete-small" on:click={() => deleteEntry(index)}>
                      🗑️
                    </button>
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- <div class="info-box">
        <h3>📊 DOPE Chart Summary</h3>
        <ul>
          <li><strong>Range:</strong> {dopeEntries[0].distance} - {dopeEntries[dopeEntries.length - 1].distance} yards</li>
          <li><strong>Data Points:</strong> {dopeEntries.length}</li>
          <li><strong>Total Drop:</strong> {dopeEntries[dopeEntries.length - 1].adjustment.toFixed(1)} (from zero)</li>
        </ul>
      </div> -->

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
        {#if isAdminUser && !isEditMode}
          <button class="btn-edit" on:click={toggleEditMode}>
            ➕ Add DOPE Data
          </button>
        {:else if !isAdminUser}
          <p class="hint">Login as admin to add DOPE data.</p>
        {/if}
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

  .error-message {
    background: rgba(244, 67, 54, 0.9);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
  }

  .success-message {
    background: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
  }

  .edit-controls {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .btn-edit, .btn-save, .btn-cancel, .btn-add {
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .btn-edit {
    background: #ff9800;
    color: white;
  }

  .btn-edit:hover {
    background: #f57c00;
  }

  .btn-save {
    background: #4caf50;
    color: white;
  }

  .btn-save:hover:not(:disabled) {
    background: #45a049;
  }

  .btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-cancel {
    background: #757575;
    color: white;
  }

  .btn-cancel:hover:not(:disabled) {
    background: #616161;
  }

  .btn-cancel:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-add {
    background: #2196f3;
    color: white;
  }

  .btn-add:hover {
    background: #1976d2;
  }

  .btn-delete-small {
    padding: 0.3rem 0.6rem;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s;
  }

  .btn-delete-small:hover {
    background: #d32f2f;
  }

  .add-entry-form {
    background: rgba(33, 150, 243, 0.1);
    border: 2px solid #2196f3;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .add-entry-form h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  .form-inline {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .input-distance, .input-adjustment {
    padding: 0.7rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    flex: 1;
    min-width: 150px;
  }

  .input-distance:focus, .input-adjustment:focus {
    outline: none;
    border-color: #2196f3;
  }

  .input-cell {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    text-align: center;
  }

  .input-cell:focus {
    outline: none;
    border-color: #2196f3;
  }

  .input-cell[readonly] {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .table-container {
    width: 100%;
    margin: 2rem auto;
    overflow-x: auto;
  }

  .dope-table {
    width: 100%;
    max-width: 600px;
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

  .mile-badge {
    display: inline-block;
    margin-left: 0.5rem;
    padding: 0.2rem 0.5rem;
    background: #27ae60;
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    border-radius: 4px;
    vertical-align: middle;
  }

  .adjustment {
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    color: #c0392b;
    font-weight: bold;
  }

  .actions {
    width: 80px;
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

  .no-data button {
    margin-top: 1rem;
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

    .form-inline {
      flex-direction: column;
    }

    .input-distance, .input-adjustment {
      min-width: 100%;
    }

    .edit-controls {
      flex-direction: column;
    }

    .btn-edit, .btn-save, .btn-cancel {
      width: 100%;
    }
  }
</style>
