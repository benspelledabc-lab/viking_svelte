<script lang="ts">
  import { apiUrl } from "$lib/api";

  let make = "";
  let model = "";
  let caliber = "";
  let barrelLength: number;
  let twist: number;
  let apiKey = "";
  let message = "";

  const handleSubmit = async () => {
    if (!make || !model || !caliber || !barrelLength || !twist || !apiKey) {
      message = "Please fill in all fields.";
      return;
    }

    try {
      const res = await fetch(apiUrl("/firearm"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          make,
          model,
          caliber,
          barrel_length: barrelLength,
          twist,
        }),
      });

      if (res.ok) {
        message = "Firearm inserted successfully!";
        make = model = caliber = apiKey = "";
        barrelLength = twist = undefined;
      } else {
        const data = await res.json();
        message = `Error: ${data.error || res.statusText}`;
      }
    } catch (err) {
      message = `Request failed: ${err}`;
    }
  };
</script>

<div class="table-container">
  <h2>Admin: Insert Firearm</h2>

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

    <input type="password" placeholder="API Key" bind:value={apiKey} />

    <button type="submit">Submit</button>

    {#if message}
      <div class="message">{message}</div>
    {/if}
  </form>
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
