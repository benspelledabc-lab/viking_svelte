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
  <title>Blank_Page</title>
  <meta name="description" content="A blank page for sandbox testing" />
</svelte:head>

<selection>
  <BlankPage url={currentUrl} />
</selection>
