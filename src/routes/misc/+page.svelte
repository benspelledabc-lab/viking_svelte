<script lang="ts">
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl } from "$lib/api"; // <-- helper for global API base

  import { onMount } from "svelte";
  import Insult from "$lib/components/Insult.svelte";
  import InsultNoTheme from "$lib/components/InsultNoTheme.svelte";
  import InsultNoThemeRepeat from "$lib/components/InsultNoThemeRepeat.svelte";
  import Baconsum from "$lib/components/Baconsum.svelte";
  import BlankPage from "$lib/components/BlankPage.svelte";
  import { page as pageStore } from "$app/stores";
  $: currentUrl = $pageStore.url.pathname;
</script>

<svelte:head>
  <title>Blank Page</title>
  <meta name="description" content="A blank page for sandbox testing" />
</svelte:head>

<!-- <BlankPage url={currentUrl} /> -->

<selection>
  <h2>Sandbox</h2>
  <div class="p-bubble parent-bubble">
    
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      This page is a sandbox for testing Svelte components.
      It contains various examples of components and their usage.
      Feel free to explore and modify the code to see how it works!
      <br />       
      <br /><span class="bullet"><a href="/misc/about">About</a></span>
      <br /><span class="bullet"><a href="/misc/examples/baconsum">BaconSum Demo</a></span>
      <br /><span class="bullet"><a href="/misc/examples/badlink">Bad Link Tracker Demo</a></span>
      <br /><span class="bullet"><a href="/pages/404_history">404 History</a></span>

      
    </p>
  </div>
</selection>
