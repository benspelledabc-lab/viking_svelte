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
</script>

<svelte:head>   
    <title>Bad Links Tracker</title>
    <meta name="description" content="Bad Links Tracker logs 404 errors including full URL, referrer, user agent, IP, and timestamp." />
</svelte:head>

<selection>
    <h2>Page Tracker</h2>
    <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            I don't really need it but I'm tracking page visits anyway. Not the actual hits,
            just the 404s from bad links. When it tracks a bad link, it logs it to the backend including the 
            full URL, referrer, user agent, ip, and timestamp.
        </p>
    </div>

    <Baconsum />
</selection>
