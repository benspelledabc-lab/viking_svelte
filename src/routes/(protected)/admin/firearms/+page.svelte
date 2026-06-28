<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const firearms = writable([]);

let newFirearm = { make: '', model: '', caliber: '', twist: '', barrel_length: '' };
let editFirearm = null;
let error = '';

async function fetchFirearms() {
    const res = await fetch(apiUrl('/firearms'));
    if (res.ok) {
        firearms.set(await res.json());
    } else {
        error = 'Failed to fetch firearms';
    }
}

async function addFirearm() {
    error = '';
    const res = await fetch(apiUrl('/firearm'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFirearm),
        credentials: 'include'
    });
    if (res.ok) {
        newFirearm = { make: '', model: '', caliber: '', twist: '', barrel_length: '' };
        fetchFirearms();
    } else {
        const errorData = await res.json();
        error = errorData.message || 'Failed to add firearm';
    }
}

async function updateFirearm() {
    error = '';
    const res = await fetch(apiUrl(`/firearm/${editFirearm.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFirearm),
        credentials: 'include'
    });
    if (res.ok) {
        editFirearm = null;
        fetchFirearms();
    } else {
        error = 'Failed to update firearm';
    }
}

async function deleteFirearm(id) {
    error = '';
    const res = await fetch(apiUrl(`/firearm/${id}`), { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
        fetchFirearms();
    } else {
        error = 'Failed to delete firearm';
    }
}

function startEdit(firearm) {
    editFirearm = { ...firearm };
}

function cancelEdit() {
    editFirearm = null;
}

onMount(fetchFirearms);
</script>

<h1>Firearm Management</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

<!-- Add Firearm Form -->
<div class="form-section">
    <h2>Add Firearm</h2>
    <input placeholder="Make" bind:value={newFirearm.make} />
    <input placeholder="Model" bind:value={newFirearm.model} />
    <input placeholder="Caliber" bind:value={newFirearm.caliber} />
    <input placeholder="Twist Rate" type="number" step="0.1" bind:value={newFirearm.twist} />
    <input placeholder="Barrel Length" type="number" step="0.1" bind:value={newFirearm.barrel_length} />
    <button on:click={addFirearm}>Add</button>
</div>

<!-- Edit Firearm Form -->
{#if editFirearm}
    <div class="form-section">
        <h2>Edit Firearm</h2>
        <input placeholder="Make" bind:value={editFirearm.make} />
        <input placeholder="Model" bind:value={editFirearm.model} />
        <input placeholder="Caliber" bind:value={editFirearm.caliber} />
        <input placeholder="Twist Rate" type="number" step="0.1" bind:value={editFirearm.twist} />
        <input placeholder="Barrel Length" type="number" step="0.1" bind:value={editFirearm.barrel_length} />
        <button on:click={updateFirearm}>Save</button>
        <button on:click={cancelEdit}>Cancel</button>
    </div>
{/if}

<!-- Firearm List -->
<h2>Firearms</h2>
<div class="firearm-list">
    {#each $firearms as firearm}
        <div class="firearm-card">
            <div class="firearm-header">
                <strong>{firearm.make} {firearm.model}</strong>
            </div>
            <div class="firearm-details">
                <div class="detail-row">
                    <span class="label">Caliber:</span>
                    <span class="value">{firearm.caliber}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Twist:</span>
                    <span class="value">{firearm.twist}"</span>
                </div>
                <div class="detail-row">
                    <span class="label">Barrel Length:</span>
                    <span class="value">{firearm.barrel_length}"</span>
                </div>
            </div>
            <div class="firearm-actions">
                <button on:click={() => startEdit(firearm)}>Edit</button>
                <button on:click={() => deleteFirearm(firearm.id)}>Delete</button>
            </div>
        </div>
    {/each}
</div>

<style>
.form-section { 
    margin-bottom: 2em;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    padding: 1.5em;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.6);
}
input { 
    margin: 0.2em;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.error { 
    color: red; 
    background: rgba(255, 200, 200, 0.8);
    padding: 0.5em;
    border-radius: 4px;
    margin-bottom: 1em;
}

.firearm-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5em;
    margin-top: 1em;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    padding: 1.5em;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.firearm-card {
    background: #fafbfc;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    padding: 1em 1.2em;
    min-width: 240px;
    max-width: 280px;
    display: flex;
    flex-direction: column;
}
.firearm-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8em;
    font-size: 1.1em;
    color: #222;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5em;
}
.firearm-details {
    display: flex;
    flex-direction: column;
    gap: 0.4em;
    margin-bottom: 0.8em;
}
.detail-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
}
.detail-row .label {
    color: #666;
    font-weight: 500;
}
.detail-row .value {
    color: #333;
}
.firearm-actions {
    margin-top: 0.5em;
    display: flex;
    gap: 0.5em;
}

button {
    padding: 0.5em 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: #4a90e2;
    color: white;
    font-weight: 500;
    transition: background 0.2s;
}

button:hover {
    background: #357abd;
}

button:active {
    background: #2d6ba3;
}
</style>
