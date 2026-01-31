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
    <title>Home</title>
    <meta name="description" content="The home page" />
</svelte:head>

<selection>
    <h2>Love Bacon?</h2>
    <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            I love bacon so Lorem Ipsum Bacon is my favorite filler text. Svelte
            has a component system also called components. Fancy that! To
            demonstrate this, I made a Baconsum component. Which uses the
            BaconSum API endpoint. Now I can generate random bacon text on
            demand.
        </p>
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            It defaults to 4 paragraphs but you can change that by passing a "p"
            property to the Baconsum component. <br />
            <br />
            &lt;Baconsum p=2 /&gt; for 2 paragraphs, <br />
            &lt;Baconsum p=3 /&gt; for 3 paragraphs, etc. <br />
            &lt;Baconsum /&gt; will default to 4 paragraphs, <br />
        </p>
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            But wait, there's more! Lets add a delay instead of hard coding the
            delay of 5000ms. Default but also allow an override. Now I can do p
            or d or dp, I guess pd also.<br />
            <br />
            &lt;Baconsum d=500 p=2 /&gt; for 2 paragraphs and refresh in 500ms,
            <br />
            &lt;Baconsum d=2000 p=3 /&gt; for 3 paragraphs and refresh in 2000ms
            <br />
            &lt;Baconsum /&gt; will default to 4 paragraphs and will refresh in 5000ms
            (default) <br />
        </p>
    </div>

    <Baconsum d={500} p={2} />
    <Baconsum d={2000} p={3} />
    <Baconsum d={5000} />
</selection>
