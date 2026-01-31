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
  <title>About</title>
  <meta name="description" content="A little about this site" />
</svelte:head>

<!-- <BlankPage url={currentUrl} /> -->

<!-- <section class="about"> -->
  <h1>About This Site</h1>
  <div class="p-bubble parent-bubble">
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      Welcome to our sandbox—a unique space for firearm enthusiasts, handloaders, and those who appreciate a bit of offbeat humor. Here, you’ll find:
    </p>
    <ul class="p-bubble child-bubble" style="animation-delay: {4 * 0.2}s">
      <li>Detailed handload data and resources for shooters of all experience levels.</li>
      <li>The Groundhog Dispatch Chart: track and share your varmint hunting stats.</li>
      <li>Jokes and lighthearted content to keep things fun.</li>
      <li>Occasional off-the-wall articles and features.</li>
    </ul>
    <p class="p-bubble child-bubble" style="animation-delay: {5 * 0.2}s">
      We value both knowledge and entertainment. Some content may be NSFW; access to these areas requires login to ensure a safe and responsible experience for all users.
    </p>
    <p class="p-bubble child-bubble" style="animation-delay: {6 * 0.2}s">
      Check out the old dynamic about page, which is really just a few snippets of things thrown together: <a href="/pages/about">here</a>.
    </p>
    <p class="p-bubble child-bubble" style="animation-delay: {6 * 0.2}s">
      Whether you’re here to learn, laugh, or log your latest groundhog dispatch, you’re in the right place. Enjoy exploring!
    </p>
  </div>
<!-- </section> -->
