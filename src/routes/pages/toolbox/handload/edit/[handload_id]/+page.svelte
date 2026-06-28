<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { apiRequest } from "$lib/api";

  // Route param
  $: handload_id = $page.params.handload_id;

  let bulletName = "";
  let bulletWeight: number | undefined;
  let caliber = "";
  let coal: number | undefined;
  let firearmId: number | undefined;
  let fpsAvg: number | undefined;
  let fpsEs: number | undefined;
  let fpsSd: number | undefined;
  let isOcw = false;
  let pathToGrt = "";
  let powderCharge: number | undefined;
  let powderName = "";

  let message = "";
  let loading = true;
  let error: string | null = null;
  let firearms: any[] = [];

  onMount(async () => {
    try {
      // Fetch both the handload and all firearms
      const [handload, firearmsData] = await Promise.all([
        apiRequest(`/handload/${handload_id}`),
        apiRequest("/firearms")
      ]);

      // Populate handload fields
      bulletName = handload.bullet_name || "";
      bulletWeight = handload.bullet_weight;
      caliber = handload.caliber || "";
      coal = handload.coal;
      firearmId = handload.firearm_id;
      fpsAvg = handload.fps_avg;
      fpsEs = handload.fps_es;
      fpsSd = handload.fps_sd;
      isOcw = handload.is_ocw || false;
      pathToGrt = handload.path_to_grt || "";
      powderCharge = handload.powder_charge;
      powderName = handload.powder_name || "";

      // Store firearms list
      firearms = firearmsData || [];
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load handload";
    } finally {
      loading = false;
    }
  });

  const handleSubmit = async () => {
    if (
      !bulletWeight ||
      !caliber ||
      firearmId === undefined ||
      !powderName
    ) {
      message = "Please fill in all required fields (Caliber, Bullet Weight, Powder Name, and Firearm).";
      return;
    }

    try {
      await apiRequest(`/handload/${handload_id}`, {
        method: "PUT",
        body: JSON.stringify({
          bullet_name: bulletName,
          bullet_weight: bulletWeight,
          caliber,
          coal,
          firearm_id: firearmId,
          fps_avg: fpsAvg,
          fps_es: fpsEs,
          fps_sd: fpsSd,
          is_ocw: isOcw,
          path_to_grt: pathToGrt,
          powder_charge: powderCharge,
          powder_name: powderName,
        }),
      });

      message = "Handload updated successfully!";
      
      // Redirect back after a short delay
      setTimeout(() => {
        window.history.back();
      }, 1500);
    } catch (err) {
      message = `Update failed: ${err instanceof Error ? err.message : err}`;
    }
  };

  const handleCancel = () => {
    window.history.back();
  };
</script>

<svelte:head>
  <title>Edit Handload {handload_id}</title>
  <meta name="description" content="Edit handload details" />
</svelte:head>

{#if loading}
  <p>Loading handload data...</p>
{:else if error}
  <p style="color: red;">Error: {error}</p>
{:else}
  <div class="form-container">
    <h2>Edit Handload {handload_id}</h2>

    <form on:submit|preventDefault={handleSubmit}>
      <label>
        Caliber: <span class="required">*</span>
        <input type="text" bind:value={caliber} placeholder="e.g., .308 Win" required />
      </label>

      <label>
        Bullet Name:
        <input type="text" bind:value={bulletName} placeholder="e.g., Sierra MatchKing" />
      </label>

      <label>
        Bullet Weight (gr): <span class="required">*</span>
        <input type="number" step="0.1" bind:value={bulletWeight} placeholder="e.g., 168" required />
      </label>

      <label>
        COAL (inches):
        <input type="number" step="0.001" bind:value={coal} placeholder="e.g., 2.800" />
      </label>

      <label>
        Powder Name: <span class="required">*</span>
        <input type="text" bind:value={powderName} placeholder="e.g., Varget" required />
      </label>

      <label>
        Powder Charge (gr):
        <input type="number" step="0.1" bind:value={powderCharge} placeholder="e.g., 43.5" />
      </label>

      <label>
        FPS Average:
        <input type="number" bind:value={fpsAvg} placeholder="e.g., 2650" />
      </label>

      <label>
        FPS Standard Deviation:
        <input type="number" bind:value={fpsSd} placeholder="e.g., 8" />
      </label>

      <label>
        FPS Extreme Spread:
        <input type="number" bind:value={fpsEs} placeholder="e.g., 25" />
      </label>

      <label>
        Firearm: <span class="required">*</span>
        <select bind:value={firearmId} required>
          <option value={undefined}>Select a firearm...</option>
          {#each firearms as firearm}
            <option value={firearm.id}>
              {firearm.make} {firearm.model} ({firearm.caliber}, {firearm.barrel_length}" barrel)
            </option>
          {/each}
        </select>
      </label>

      <label class="checkbox-label">
        <input type="checkbox" bind:checked={isOcw} />
        OCW Load
      </label>

      <label>
        Path to GRT:
        <input type="text" bind:value={pathToGrt} placeholder="Optional URL or path" />
      </label>

      <div class="button-group">
        <button type="submit">Update Handload</button>
        <button type="button" on:click={handleCancel} class="cancel-btn">Cancel</button>
      </div>
    </form>

    {#if message}
      <p class="message" class:success={message.includes("success")} class:error={message.includes("failed")}>
        {message}
      </p>
    {/if}
  </div>
{/if}

<style>
  .form-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    color: #555;
  }

  .required {
    color: red;
    margin-left: 0.25rem;
  }

  input[type="text"],
  input[type="number"],
  select {
    margin-top: 0.25rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }

  .checkbox-label {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    flex: 1;
    padding: 0.75rem;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #357abd;
  }

  .cancel-btn {
    background-color: #6c757d;
  }

  .cancel-btn:hover {
    background-color: #5a6268;
  }

  .message {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 0.25rem;
    text-align: center;
    font-weight: 600;
  }

  .message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
</style>
