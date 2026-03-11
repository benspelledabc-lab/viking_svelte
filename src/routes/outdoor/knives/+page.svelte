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

<svelte:head>
  <title>Knife Sharpening Log</title>
  <meta name="description" content="Knife Sharpening Log for me!" />
</svelte:head>


<h1>Knife Sharpening Log</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

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
                                {#if knife.image_path.startsWith('s3://')}
                                    <a href={knife.image_path.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com')} target="_blank" rel="noopener">
                                        <img src={knife.image_path.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com')} alt="knife image" width="60" style="cursor:pointer;" />
                                    </a>
                                {:else}
                                    <a href={knife.image_path} target="_blank" rel="noopener">
                                        <img src={knife.image_path} alt="knife image" width="60" style="cursor:pointer;" />
                                    </a>
                                {/if}
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<div class="p-bubble parent-bubble"><h4>Knives listed as a zero angle blade are not measured accurately. 
    They are placeholders for the knives I have but haven't measured.</h4>
</div>

<style>
.bubble-table {
    padding: 1rem;
    margin: 1rem auto;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
