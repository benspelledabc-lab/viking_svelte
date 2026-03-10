
<script>


import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const entries = writable([]);

let newEntry = { topic: '', body: '', isViewable: true };
let editEntry = null;
let error = '';

async function fetchEntries() {
    const res = await fetch(apiUrl('/journal_entries'), {
        credentials: 'include'
    });
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
<h2>Entries ({$entries.length} total)</h2>
<div class="entries-container">
    {#each $entries as entry}
        <div class="entry-row">
            <div class="entry-content">
                <div class="entry-header">
                    <strong>{entry.topic}</strong>
                    <span class="entry-date">{entry.dateEntered ? new Date(entry.dateEntered).toLocaleString() : ''}</span>
                </div>
                <div class="entry-body">{entry.body}</div>
                <div class="entry-meta">
                    <span class="entry-visibility">{entry.isViewable ? '👁️ Public' : '🔒 Private'} <span class="entry-id">(id: {entry.id})</span></span>
                </div>
            </div>
            <div class="entry-actions">
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

.entries-container {
    max-width: 1200px;
    margin: 1em auto;
    display: flex;
    flex-direction: column;
    gap: 1em;
    max-height: 70vh;
    overflow-y: auto;
    padding: 0.5em;
}

.entry-row {
    background: #fafbfc;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    padding: 1em;
    display: flex;
    gap: 1em;
    align-items: flex-start;
    transition: transform 0.2s, box-shadow 0.2s;
}

.entry-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.entry-content {
    flex: 1;
    min-width: 0;
}

.entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5em;
    flex-wrap: wrap;
    gap: 0.5em;
}

.entry-header strong {
    font-size: 1.1em;
    color: #333;
}

.entry-date {
    font-size: 0.9em;
    color: #666;
    white-space: nowrap;
}

.entry-body {
    margin: 0.5em 0;
    white-space: pre-wrap;
    line-height: 1.5;
    color: #444;
}

.entry-meta {
    margin-top: 0.5em;
}

.entry-visibility {
    font-size: 0.9em;
    color: #888;
}

.entry-id {
    font-size: 0.85em;
    color: #aaa;
}

.entry-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    min-width: 80px;
}

.entry-actions button {
    white-space: nowrap;
    padding: 0.4em 0.8em;
}
</style>
