<script lang="ts">
  import { apiRequest } from "$lib/api";

  let bulletName = "";
  let bulletWeight: number;
  let caliber = "";
  let coal: number;
  let firearmId: number;
  let fpsAvg: number;
  let fpsEs: number;
  let fpsSd: number;
  let isOcw = false;
  let pathToGrt = "";
  let powderCharge: number;
  let powderName = "";

  let message = "";

  const handleSubmit = async () => {
    if (
      !bulletName ||
      !bulletWeight ||
      !caliber ||
      firearmId === undefined ||
      !powderName
    ) {
      message = "Please fill in all required fields.";
      return;
    }

    try {
      const data = await apiRequest("/handload", {
        method: "POST",
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

      message = "Handload inserted successfully!";
      bulletName = caliber = powderName = pathToGrt = "";
      bulletWeight =
        coal =
        firearmId =
        fpsAvg =
        fpsEs =
        fpsSd =
        powderCharge =
          undefined;
      isOcw = false;
    } catch (err) {
      message = `Request failed: ${err instanceof Error ? err.message : err}`;
    }
  };
</script>

<div class="table-container">
  <h2>Admin: Insert Handload</h2>

  <div class="form-card">
    <form on:submit|preventDefault={handleSubmit}>
      <input placeholder="Bullet Name" bind:value={bulletName} />
      <input
        type="number"
        placeholder="Bullet Weight (gr)"
        bind:value={bulletWeight}
      />
      <input placeholder="Caliber" bind:value={caliber} />
      <input type="number" step="0.001" placeholder="COAL" bind:value={coal} />
      <input type="number" placeholder="Firearm ID" bind:value={firearmId} />

      <input type="number" placeholder="FPS Avg" bind:value={fpsAvg} />
      <input type="number" placeholder="FPS ES" bind:value={fpsEs} />
      <input type="number" placeholder="FPS SD" bind:value={fpsSd} />

      <label class="checkbox">
        <input type="checkbox" bind:checked={isOcw} />
        OCW Load
      </label>

      <input placeholder="Powder Name" bind:value={powderName} />
      <input
        type="number"
        step="0.01"
        placeholder="Powder Charge (gr)"
        bind:value={powderCharge}
      />
      <input placeholder="Path to GRT" bind:value={pathToGrt} />

      <button type="submit">Submit</button>

      {#if message}
        <div class="message">{message}</div>
      {/if}
    </form>
  </div>
</div>

<style>
  .form-card {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
  }

  form {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: auto;
    margin-bottom: 2rem;
  }

  input,
  button {
    margin: 8px 0;
    padding: 8px;
    font-size: 1rem;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
  }

  .message {
    margin-top: 12px;
    font-weight: bold;
  }

  .table-container {
    max-width: 800px;
    margin: auto;
  }
</style>
