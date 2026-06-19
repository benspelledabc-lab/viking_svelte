<script lang="ts">
    import Top404s from "$lib/components/Top404s.svelte";
    import { fly } from 'svelte/transition';
    import { onMount } from "svelte";
    let show404s = false;

    // Show the 404 modal on page load, then hide it after 2.5 seconds
    onMount(() => {
      setTimeout(() => {
        show404s = false;
      }, 2500); // 2.5 seconds delay
    });
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
  <title>Misc Junk</title>
  <meta name="description" content="A bit bucket for junk" />
</svelte:head>

<!-- <BlankPage url={currentUrl} /> -->

<selection>
  <h2>Sandbox</h2>
  <div class="p-bubble parent-bubble">
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      This page is a sandbox for testing Svelte components.<br>
      It contains various examples of components and their usage.<br>
      Feel free to explore and modify the code to see how it works!<br>
      <br /><span class="bullet"><a href="/misc/examples/baconsum">BaconSum Demo</a></span>
      <br /><span class="bullet"><a href="/misc/examples/badlink">Bad Link Tracker Demo</a></span>
      <br /><span class="bullet"><a href="/pages/404_history">404 History</a></span>      
    </p>
    <!-- Modal auto-shows on page load -->
    {#if show404s}
      <div class="modal-overlay" on:click={() => show404s = false}>
        <div class="modal-window" transition:fly="{{ x: -200, duration: 350 }}" on:click|stopPropagation>
          <button class="close-btn" on:click={() => show404s = false}>&times;</button>
          <Top404s count={5} />
        </div>
      </div>
    {/if}
  </div>
<style>
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
