<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { apiRequest } from "$lib/api";

    export const insult = writable("");
    export let url = "";
</script>

<div class="motd-insult">
    <h2>Blank Page</h2>
    <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
            This page was intentionally left blank. (<i>{url}</i>)
        </p>
    </div>
</div>
