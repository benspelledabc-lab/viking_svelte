<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const removals = writable([]);
let error = '';
let loading = true;

async function fetchRemovals() {
    try {
        const res = await fetch(apiUrl('/groundhog_removals'));
        if (res.ok) {
            removals.set(await res.json());
        } else {
            error = 'Failed to fetch groundhog removals';
        }
    } finally {
        loading = false;
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
}

function formatTime(timeStr) {
    if (!timeStr) return 'N/A';
    // Remove seconds from HH:MM:SS format
    return timeStr.substring(0, 5);
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
        <div class="nav-links">
            <a href="/outdoor/groundhog_removals/stats" class="stats-link">📊 View Statistics & Graphs</a>
        </div>
    </div>
</div>

{#if error}
    <div class="error">{error}</div>
{/if}

<div class="p-bubble parent-bubble bubble-table">
    <div class="table-container">
    <h4 class="mobile-hint">Small screen found: Scroll left|right.</h4>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Yards</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {#each $removals as removal}
                    <tr>
                        <td>{formatDate(removal.removal_date)}</td>
                        <td>{formatTime(removal.time_of_removal)}</td>   
                        <td>{removal.shot_distance_yards || 'N/A'}</td>                   
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

{#if loading}
    <div class="p-bubble parent-bubble">
        <div class="spinner-container">
            <div class="spinner"></div>
            <p>Loading groundhog removals...</p>
        </div>
    </div>
{:else if $removals.length === 0}
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

.nav-links {
    margin: 20px 0;
}

.stats-link {
    display: inline-block;
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
    font-weight: bold;
    transition: all 0.3s;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.stats-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    border-color: rgba(255, 255, 255, 0.6);
}

.mobile-hint {
    display: none;
}

@media (max-width: 768px) {
    .mobile-hint {
        display: block;
    }
}

.spinner-container {
    text-align: center;
    padding: 2rem;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
