<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const knives = writable([]);
let error = '';

async function fetchKnives() {
    const res = await fetch(apiUrl('/knives'));
    if (res.ok) {
        knives.set(await res.json());
    } else {
        error = 'Failed to fetch knives';
    }
}

onMount(fetchKnives);
</script>


<h1>Knife Sharpening Log</h1>

{#if error}
    <div class="error">{error}</div>
{/if}


<h2>Knives</h2>
<div class="p-bubble parent-bubble bubble-table">
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Angle</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {#each $knives as knife, i}
                    <tr>
                        <td>{knife.name}</td>
                        <td>{knife.angle}</td>
                        <td>
                            {#if knife.image_path}
                                <img src={knife.image_path} alt="knife image" width="80" />
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
.bubble-table {
    padding: 1rem;
    margin: 1rem auto;
    border-radius: 1rem;
    background-color: #f7f3f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.table-container {
    width: 100%;
    text-align: center;
    overflow-x: auto;
}
table {
    border-collapse: collapse;
    font-size: 0.85rem;
    width: 100%;
    table-layout: auto;
    margin-bottom: 1em;
}
th, td {
    border: 1px solid #ccc;
    padding: 0.3rem 0.5rem;
    text-align: left;
    position: relative;
}
th {
    background: #d2b48c;
    color: #000;
}
tbody tr:nth-child(even) {
    background-color: #e1dede;
}
tbody tr:nth-child(odd) {
    background-color: #fff;
}
tbody tr:hover {
    background-color: #f0e6d6;
}
.error { color: red; }
img { margin-top: 0.5em; border: 1px solid #ccc; border-radius: 4px; }
</style>
