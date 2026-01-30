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
    <span>{$insult}</span>
</div>
