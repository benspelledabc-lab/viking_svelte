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

<div class="table-container">
    <h2>Vicious Mockery</h2>
    <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble">
            <strong>Random Insult:</strong><br/>
            {$insult}
        </p>
        <button class="refresh-btn" on:click={fetchInsult} aria-label="Get another insult">
            🔄 Get Another
        </button>
    </div>
</div>

<style>
    .refresh-btn {
        margin-top: 0.5rem;
        padding: 0.6em 1.2em;
        background: rgba(74, 144, 226, 0.9);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.95em;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .refresh-btn:hover {
        background: rgba(53, 122, 189, 0.95);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .refresh-btn:active {
        transform: translateY(0);
    }
</style>
