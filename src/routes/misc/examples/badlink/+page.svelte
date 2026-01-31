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

    let randomWord = '';

    function cleanWord(word: string): string {
        // Remove trailing punctuation (.,!?:;)
        return word.replace(/[.,!?:;]+$/, '');
    }

    async function getRandomBaconWord() {
        try {
            const res = await fetch(apiUrl('/bacon?p=13'));
            const data = await res.json();
            if (Array.isArray(data.content) && data.content.length > 0) {
                // Split the first paragraph into words
                const words = data.content[0].split(/\s+/).filter(Boolean);
                if (words.length > 0) {
                    let word = words[Math.floor(Math.random() * words.length)];
                    randomWord = cleanWord(word);
                }
            }
        } catch (err) {
            randomWord = 'Error fetching word';
        }
    }

    onMount(() => {
        getRandomBaconWord();
    });
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

    <h2>Example</h2>
    <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            I don't really need it but I'm tracking page visits anyway. Not the actual hits,
            just the 404s from bad links. When it tracks a bad link, it logs it to the backend including the 
            full URL, referrer, user agent, ip, and timestamp.
        </p>
        <p class="p-bubble child-bubble" style="animation-delay: {4 * 0.2}s">
            Click <a href="/misc/examples/badlink/{randomWord}">here</a> to test a random bad link
        </p>   
    </div>

    <div class="p-bubble parent-bubble">
        <h2>Random Bacon (& other meat-ish) Word</h2>
        <p class="p-bubble child-bubble" style="animation-delay: {2 * 0.2}s">{randomWord}</p>
        <button on:click={getRandomBaconWord}>Get Another</button>
    </div>

    <!-- <Baconsum /> -->
</selection>
