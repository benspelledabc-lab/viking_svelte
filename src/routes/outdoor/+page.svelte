<script lang="ts">
    import Top404s from "$lib/components/Top404s.svelte";
    import { fly } from 'svelte/transition';
    import { onMount } from "svelte";

  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl } from "$lib/api"; // <-- helper for global API base
  
  import Insult from "$lib/components/Insult.svelte";
  import InsultNoTheme from "$lib/components/InsultNoTheme.svelte";
  import InsultNoThemeRepeat from "$lib/components/InsultNoThemeRepeat.svelte";
  import Baconsum from "$lib/components/Baconsum.svelte";
  import BlankPage from "$lib/components/BlankPage.svelte";
  import { page as pageStore } from "$app/stores";
  $: currentUrl = $pageStore.url.pathname;
</script>

<svelte:head>
  <title>Outdoor Sandbox</title>
  <meta name="description" content="Outdoor elements." />
</svelte:head>

<!-- <BlankPage url={currentUrl} /> -->

<selection>
  <div class="p-bubble parent-bubble bubble-table">
    <h2>You really shouldn't be here, but incase you are, pick from a link below.</h2>
    <div>
      <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">                
        <span class="bullet"><a href="/outdoor/knives/">Knife Sharpening Log</a></span>
        <br /><span class="bullet"><a href="/outdoor/handloads/">Handloads</a></span>
      </p>
      
    </div>
  </div>
<style>
.bubble-table {
  padding: 1rem;
  margin: 1rem auto;
  border-radius: 1rem;
  background-color: #f7f3f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    background: none;
    z-index: 1000;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 3em 0 0 3em;
    pointer-events: none;
  }
  .modal-window {
    background: #fff;
    border-radius: 1em;
    box-shadow: none;
    padding: 1.2em 1em 1em 1em;
    min-width: 260px;
    max-width: 350px;
    min-height: 80px;
    position: relative;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    pointer-events: auto;
  }
  .close-btn {
    position: absolute;
    top: 0.5em;
    right: 0.7em;
    background: none;
    border: none;
    font-size: 2em;
    color: #888;
    cursor: pointer;
    z-index: 1002;
    line-height: 1;
    padding: 0;
  }
  .close-btn:hover {
    color: #b36b00;
  }
</style>
</selection>
