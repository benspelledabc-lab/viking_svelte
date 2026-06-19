<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { apiRequest } from "$lib/api";

  // Route param
  $: firearm_id = $page.params.firearm_id;

  let make = "";
  let model = "";
  let caliber = "";
  let barrel_length: number | undefined;
  let twist: number | undefined;
  let message = "";
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const firearm = await apiRequest(`/firearm/${firearm_id}`);
      make = firearm.make || "";
      model = firearm.model || "";
      caliber = firearm.caliber || "";
      barrel_length = firearm.barrel_length;
      twist = firearm.twist;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load firearm";
    } finally {
      loading = false;
    }
  });

  const handleSubmit = async () => {
    if (!make || !model || !caliber || !barrel_length || !twist) {
      message = "Please fill in all fields.";
      return;
    }

    try {
      await apiRequest(`/firearm/${firearm_id}`, {
        method: "PUT",
        body: JSON.stringify({
          make,
          model,
          caliber,
          barrel_length,
          twist,
        }),
      });

      message = "Firearm updated successfully!";
      
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
  <title>Edit Firearm {firearm_id}</title>
  <meta name="description" content="Edit firearm details" />
</svelte:head>

{#if loading}
  <p>Loading firearm data...</p>
{:else if error}
  <p style="color: red;">Error: {error}</p>
{:else}
  <div class="form-container">
    <h2>Edit Firearm {firearm_id}</h2>

    <form on:submit|preventDefault={handleSubmit}>
      <label>
        Make:
        <input type="text" bind:value={make} placeholder="e.g., Remington" />
      </label>

      <label>
        Model:
        <input type="text" bind:value={model} placeholder="e.g., 700" />
      </label>

      <label>
        Caliber:
        <input type="text" bind:value={caliber} placeholder="e.g., .308 Win" />
      </label>

      <label>
        Barrel Length (inches):
        <input type="number" step="0.1" bind:value={barrel_length} placeholder="e.g., 24" />
      </label>

      <label>
        Twist Rate (1:X):
        <input type="number" step="0.1" bind:value={twist} placeholder="e.g., 10" />
      </label>

      <div class="button-group">
        <button type="submit">Update Firearm</button>
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

  input {
    margin-top: 0.25rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
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
