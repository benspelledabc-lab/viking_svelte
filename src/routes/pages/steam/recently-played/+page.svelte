<script>
  import { onMount } from "svelte";
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl } from "$lib/api";

  //loading spinner
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { fade } from "svelte/transition";

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
      // 🔧 simulate work (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

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

<div class="table-container">
  {#if loading}
    <div in:fade class="p-bubble parent-bubble spinner-container">
      <LoadingSpinner size={92} thickness={18} />
      <h2>Fetching data from database....</h2>
    </div>
  {:else if error}
    <p style="color:red;">{error}</p>
  {:else if page}
    <h2>{page.display_name}</h2>
    <div class="p-bubble parent-bubble">
      <h2>Steam Recently Played</h2>
      <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
        OOf. Yes, the formatting/layout is bufugly on a mobile device. I'm just
        pulling the 'about_the_game' tag from Steam's API and shoving it into
        the site. This is not ALL of the games I've played. These are just the
        games in the last two weeks or so, that are also on steam.
      </p>
    </div>

    {#each page.recent_games as block}
      <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          <strong>{@html block.name}</strong> -
          <i>{formatPlaytime(block.playtime_forever)}</i><br /><br />
          {@html block.about_the_game}
        </p>
      </div>
    {/each}
  {:else}
    <p>No page content found.</p>
  {/if}
</div>
