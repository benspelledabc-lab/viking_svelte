<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { apiRequest } from "$lib/api";

  export let p = 4;
  export let d = 5000; // refresh delay in ms
  export const baconsum = writable([]);

  export async function fetchBaconsum() {
    try {
      const data = await apiRequest(`/bacon?p=${p}`);
      // The API returns { content: [...] }
      if (Array.isArray(data.content)) {
        baconsum.set(data.content);
      } else {
        baconsum.set(["No bacon found."]);
      }
    } catch (e) {
      baconsum.set(["Could not load bacon."]);
    }
  }

  let intervalId;
  onMount(() => {
    fetchBaconsum();
    intervalId = setInterval(fetchBaconsum, d);
    return () => clearInterval(intervalId);
  });
</script>

<div class="table-container">
  <h2>Bacon Ipsum</h2>
  <div class="p-bubble parent-bubble">
    {#each $baconsum as paragraph, i}
      <p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">
        {paragraph}
      </p>
    {/each}
  </div>
</div>
