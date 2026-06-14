<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const removals = writable([]);
let error = '';

async function fetchRemovals() {
    const res = await fetch(apiUrl('/groundhog_removals'));
    if (res.ok) {
        removals.set(await res.json());
    } else {
        error = 'Failed to fetch groundhog removals';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
}

onMount(fetchRemovals);
</script>

<svelte:head>
  <title>Groundhog Removals</title>
  <meta name="description" content="Groundhog Removals tracking" />
</svelte:head>


<div class="p-bubble parent-bubble bubble-table">
    <div class="table-container">
        <h1>Groundhog Removals</h1>
        <p>Tracking successful groundhog removals with details on distance, conditions, and results.</p>
    </div>
</div>

{#if error}
    <div class="error">{error}</div>
{/if}

<div class="p-bubble parent-bubble bubble-table">
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Weight (lbs)</th>
                    <th>Distance (yds)</th>
                    <th>Sex</th>
                    <th>Temp (°F)</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {#each $removals as removal}
                    <tr>
                        <td>{formatDate(removal.removal_date)}</td>
                        <td>{removal.time_of_removal || 'N/A'}</td>
                        <td>{removal.estimated_weight_lbs || 'N/A'}</td>
                        <td>{removal.shot_distance_yards || 'N/A'}</td>
                        <td>{removal.sex || 'unknown'}</td>
                        <td>{removal.temperature || 'N/A'}</td>
                        <td>
                            <a href="/outdoor/groundhog_removals/{removal.id}" class="details-link">
                                View Details
                                {#if removal.image_path || (removal.images && removal.images.length > 0)}
                                    <span class="image-count">
                                        ({(removal.image_path ? 1 : 0) + (removal.images ? removal.images.length : 0)} 📷)
                                    </span>
                                {/if}
                            </a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

{#if $removals.length === 0}
    <div class="p-bubble parent-bubble">
        <h4>No groundhog removals recorded yet.</h4>
    </div>
{/if}

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

.details-link {
    color: #4CAF50;
    text-decoration: none;
    font-weight: 500;
    display: inline-block;
}

.details-link:hover {
    text-decoration: underline;
}

.image-count {
    font-size: 0.85em;
    color: #666;
    margin-left: 0.3em;
}
</style>
