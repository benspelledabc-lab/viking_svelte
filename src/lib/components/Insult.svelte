<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { apiRequest } from "$lib/api";

    export const insult = writable("");

    export async function fetchInsult() {
        try {
            const data = await apiRequest("/vicious-mockery/random");
            insult.set(data.insult || "No insult found.");
        } catch (e) {
            insult.set("Could not load insult.");
        }
    }

    onMount(fetchInsult);
</script>

<div class="motd-insult">
    <strong>Random Insult:</strong>
    <span>{$insult}</span>
    <button on:click={fetchInsult} aria-label="Get another insult">🔄</button>
</div>

<style>
    .motd-insult {
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffeeba;
        border-radius: 6px;
        padding: 1em;
        margin: 1em 0;
        display: flex;
        align-items: center;
        gap: 1em;
    }
    .motd-insult button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
    }
</style>
