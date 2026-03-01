
<script>


import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const entries = writable([]);

let newEntry = { topic: '', body: '', isViewable: true };
let editEntry = null;
let error = '';

async function fetchEntries() {
    const res = await fetch(apiUrl('/journal_entries'));
    if (res.ok) {
        entries.set(await res.json());
    } else {
        error = 'Failed to fetch journal entries';
    }
}

async function addEntry() {
    error = '';
    const payload = { ...newEntry };
    const res = await fetch(apiUrl('/journal_entry'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    });
    if (res.ok) {
        newEntry = { topic: '', body: '', isViewable: true };
        fetchEntries();
    } else {
        error = 'Failed to add journal entry';
    }
}

async function updateEntry() {
    error = '';
    const res = await fetch(apiUrl(`/journal_entry/${editEntry.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editEntry),
        credentials: 'include'
    });
    if (res.ok) {
        editEntry = null;
        fetchEntries();
    } else {
        error = 'Failed to update journal entry';
    }
}

async function deleteEntry(id) {
    error = '';
    const res = await fetch(apiUrl(`/journal_entry/${id}`), { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
        fetchEntries();
    } else {
        error = 'Failed to delete journal entry';
    }
}

function startEdit(entry) {
    editEntry = { ...entry };
}

function cancelEdit() {
    editEntry = null;
}

onMount(fetchEntries);
</script>

<h1>Journal Entries</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

<!-- Add Journal Entry Form -->
<div class="form-section">
    <h2>Add Journal Entry</h2>
    <input placeholder="Topic" bind:value={newEntry.topic} />
    <br />
    <textarea placeholder="Body" bind:value={newEntry.body} rows="10" style="width:100%; min-height:200px; font-size:1.1em;"></textarea>
    <label><input type="checkbox" bind:checked={newEntry.isViewable} /> Viewable</label>
    <button on:click={addEntry}>Add</button>
</div>

<!-- Edit Journal Entry Form -->
{#if editEntry}
    <div class="form-section">
        <h2>Edit Journal Entry</h2>
        <input placeholder="Topic" bind:value={editEntry.topic} />
        <br />
        <textarea placeholder="Body" bind:value={editEntry.body} rows="10" style="width:100%; min-height:200px; font-size:1.1em;"></textarea>
        <label><input type="checkbox" bind:checked={editEntry.isViewable} /> Viewable</label>
        <button on:click={updateEntry}>Save</button>
        <button on:click={cancelEdit}>Cancel</button>
    </div>
{/if}

<!-- Journal Entry List -->
<h2>Entries</h2>
<div class="knife-list">
    {#each $entries as entry}
        <div class="knife-card">
            <div class="knife-header">
                <strong>{entry.topic}</strong>
            </div>
            <div class="knife-angle">{entry.dateEntered ? new Date(entry.dateEntered).toLocaleString() : ''}</div>
            <div style="margin: 0.5em 0; width: 100%; white-space: pre-wrap;">{entry.body}</div>
            <div style="font-size: 0.9em; color: #888; margin-bottom: 0.5em;">{entry.isViewable ? 'Viewable' : 'Private'}</div>
            <div class="knife-actions">
                <button on:click={() => startEdit(entry)}>Edit</button>
                <button on:click={() => deleteEntry(entry.id)}>Delete</button>
            </div>
        </div>
    {/each}
</div>

<style>
/* ...existing code... */
.form-section { margin-bottom: 2em; }
input { margin: 0.2em; }
.error { color: red; }
img { margin-top: 0.5em; border: 1px solid #ccc; border-radius: 4px; }

.knife-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5em;
    margin-top: 1em;
}
.knife-card {
    background: #fafbfc;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    padding: 1em 1.2em;
    min-width: 200px;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.knife-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5em;
}
.knife-angle {
    font-size: 0.95em;
    color: #555;
}
.knife-image {
    margin-bottom: 0.5em;
}
.knife-actions {
    margin-top: 0.5em;
    display: flex;
    gap: 0.5em;
}
</style>
