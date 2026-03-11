<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { apiRequest } from "$lib/api";

  export let p = 4;
  export let d = 4 * 60 * 60 * 1000; // 4 hours in ms
  export const jokesum = writable([]);

  let punchlineRevealed = false;
  function revealPunchline() {
    punchlineRevealed = true;
  }

  export async function fetchJokesum() {
    try {
      const data = await apiRequest(`/joke/random`);
      // The API now returns { setup: "...", punchline: "...", categories: ["...", ...] }
      if (data && data.setup) {
        jokesum.set([
          {
            categories: Array.isArray(data.categories) ? data.categories : [data.category || "Unknown"],
            setup: data.setup,
            punchline: data.punchline
          }
        ]);
        punchlineRevealed = false;
      } else {
        jokesum.set(["No jokes found."]);
        punchlineRevealed = false;
      }
    } catch (e) {
      jokesum.set(["Could not load jokes."]);
      punchlineRevealed = false;
    }
  }

  let intervalId;
  onMount(() => {
    fetchJokesum();
    // Only set interval if d is a positive number
    if (typeof d === 'number' && d > 0) {
      intervalId = setInterval(fetchJokesum, d);
      return () => clearInterval(intervalId);
    }
    return undefined;
  });
</script>

<div class="table-container">
  <h2>Joke</h2>
  <div class="p-bubble parent-bubble">
    {#each $jokesum as joke, i}
      <div class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">
        <div><b>Categories:</b>
          {#if joke.categories && joke.categories.length > 0}
            {joke.categories.join(', ')}
          {:else}
            Unknown
          {/if}
        </div>
        <div><b>Setup:</b> {joke.setup}</div>
        <div class="punchline-container">
          <b>Punchline:</b>
          <span
            class:punchline-blur={!punchlineRevealed}
            class:punchline-waiting={!punchlineRevealed}
            on:click={revealPunchline}
            style="cursor:pointer; user-select:none;"
            title={!punchlineRevealed ? 'Click to reveal punchline' : ''}
          >
            {joke.punchline}
          </span>
          {#if !punchlineRevealed}
            <span class="punchline-hint">👈 Click to reveal</span>
          {/if}
        </div>
        <div class="refresh-container">
          <button on:click={fetchJokesum} class="refresh-btn" title="Get a new joke">🔄 Groan More</button>
        </div>
      </div>
    {/each}
  <style>
    .refresh-container {
      margin-top: 1em;
      text-align: left;
    }
    .refresh-btn {
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.5em 1em;
      font-size: 0.9em;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }
    .refresh-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
    .refresh-btn:active {
      transform: translateY(0);
    }
    .punchline-blur {
      filter: blur(0.5em);
      color: #888;
      transition: filter 0.2s, color 0.2s;
    }
  .punchline-container {
    margin-top: 0.5em;
    padding: 0.5em;
    background: #f8f8e7;
    border-radius: 0.4em;
    border: 1.5px dashed #bba800;
    display: inline-block;
    position: relative;
  }
  .punchline-blur {
    filter: blur(0.5em);
    color: #888;
    transition: filter 0.2s, color 0.2s;
    font-weight: bold;
    font-size: 1.1em;
    letter-spacing: 0.04em;
  }
  .punchline-waiting {
    background: #fffbe6;
    padding: 0.2em 0.5em;
    border-radius: 0.3em;
    border: 1px dotted #bba800;
    box-shadow: 0 0 4px #fffbe6;
  }
  .punchline-hint {
    margin-left: 0.7em;
    color: #bba800;
    font-size: 0.95em;
    font-style: italic;
    vertical-align: middle;
    user-select: none;
    pointer-events: none;
  }
  </style>
  </div>
</div>
