<script>
  import { onMount } from "svelte";
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl } from "$lib/api";
  import JokeSum from "$lib/components/Joke-Random.svelte";

  // Helper: convert minutes to "X days Y hours"
  function formatPlaytime(minutes) {
    if (!minutes) return "0h";
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = minutes % 60;

    let parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (!days && !hours && mins) parts.push(`${mins}m`);
    return parts.join(" ");
  }

  onMount(async () => {
    try {
      const res = await fetch(apiUrl(`/steam/recent-games`));
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      page = await res.json();
      console.log("Page data:", page);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Jokes</title>
  <meta name="description" content="Jokes page" />
</svelte:head>

<selection>
  <div class="p-bubble parent-bubble"> 
          <strong>WARNING       </strong>
          <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            Please keep in mind that these jokes got leached and are not guaranteed to be good. 
            If you have a joke that you think is good, please submit it to the database so it can 
            be included in the rotation. Some of them are pretty bad, but some are actually funny. Enjoy!
          </p>
          <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            Before you click to reveal the joke, you should consider the "<i>Categories</i>" the joke is in.
          </p>
      </div>
</selection>

<JokeSum />

