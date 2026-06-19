<script lang="ts">
  import { apiRequest } from "$lib/api";
  import { goto } from "$app/navigation";

  let make = "";
  let model = "";
  let caliber = "";
  let barrelLength: number;
  let twist: number;
  let message = "";

  let createdFirearmId: number | null = null;

  const handleSubmit = async () => {
    if (!make || !model || !caliber || !barrelLength || !twist) {
      message = "Please fill in all fields.";
      return;
    }

    try {
      const data = await apiRequest("/firearm", {
        method: "POST",
        body: JSON.stringify({
          make,
          model,
          caliber,
          barrel_length: barrelLength,
          twist,
        }),
      });

      console.log("Firearm POST response:", data);

      // <-- use `id` from as_dict()
      createdFirearmId = data.firearm_id;
      message = `Firearm inserted successfully! (ID: ${createdFirearmId})`;

      // reset form
      make = model = caliber = "";
      barrelLength = twist = undefined;
    } catch (err) {
      message = `Request failed: ${err instanceof Error ? err.message : err}`;
    }
  };

  const goToHandload = () => {
    if (createdFirearmId) {
      goto(`/handloads/new?firearm_id=${createdFirearmId}`);
    }
  };
</script>

<div class="p-bubble parent-bubble bubble-table">
  <div class="table-container">
    <h2>Insert Firearm</h2>

    <form on:submit|preventDefault={handleSubmit}>
      <input placeholder="Make" bind:value={make} />
      <input placeholder="Model" bind:value={model} />
      <input placeholder="Caliber" bind:value={caliber} />

      <input
        type="number"
        placeholder="Barrel Length"
        bind:value={barrelLength}
      />

      <input type="number" placeholder="Twist" bind:value={twist} />

      <button type="submit">Submit</button>

      {#if message}
        <div class="message">{message}</div>
      {/if}
    </form>

    <!-- {#if createdFirearmId}
    <button on:click={goToHandload} style="margin-top: 1rem;">
      Create Handload for This Firearm
    </button>
  {/if} -->
  </div>
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    margin: auto;
    margin-bottom: 2rem;
  }

  input,
  textarea,
  button {
    margin: 8px 0;
    padding: 8px;
    font-size: 1rem;
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
