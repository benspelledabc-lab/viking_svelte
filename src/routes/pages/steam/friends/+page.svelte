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

  // Helper: convert Unix timestamp to readable date/time
  function formatLastLogoff(timestamp) {
    if (!timestamp) return "never";

    const d = new Date(timestamp * 1000); // JS uses milliseconds
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    };
    return d.toLocaleString(undefined, options); // uses local timezone
  }

  onMount(async () => {
    try {
      // 🔧 simulate work (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await fetch(apiUrl(`/steam/friends-summaries`));
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      page = await res.json();

      // Sort by lastlogoff (descending), then by personaname
      if (page.players) {
        page.players.sort((a, b) => {
          // Compare lastlogoff descending (most recent first)
          const diff = (b.lastlogoff || 0) - (a.lastlogoff || 0);
          if (diff !== 0) return diff;

          // Tie-breaker: alphabetical by name
          return a.personaname.localeCompare(b.personaname, undefined, {
            sensitivity: "base",
          });
        });
      }

      console.log("Page data:", page);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Steam: Friends</title>
  <meta name="description" content="Steam Friends" />
</svelte:head>

<selection>
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
        <h2>Friends List</h2>
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          Sorting "friends" by their displayed 'lastlogoff' value, then by name
          for tie breakers.
        </p>
      </div>

      {#each page.players as block}
        <div class="p-bubble parent-bubble">
          <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            <img src={block.avatar} alt={block.personaname} /> -
            <a href={block.profileurl} title={block.personaname}
              ><strong>{@html block.personaname}</strong></a
            ><br />
            ( Last online: {formatLastLogoff(block.lastlogoff)} )
          </p>
        </div>
      {/each}
    {:else}
      <p>No page content found.</p>
    {/if}
  </div>
</selection>
