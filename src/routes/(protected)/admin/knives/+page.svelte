<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const knives = writable([]);

let newKnife = { name: '', angle: '' };
let newKnifeImage = null;
let editKnife = null;
let error = '';

async function fetchKnives() {
    const res = await fetch(apiUrl('/knives'));
    if (res.ok) {
        knives.set(await res.json());
    } else {
        error = 'Failed to fetch knives';
    }
}

async function addKnife() {
    error = '';
    const formData = new FormData();
    formData.append('name', newKnife.name);
    formData.append('angle', newKnife.angle);
    if (newKnifeImage) {
        formData.append('image', newKnifeImage);
    }
    const res = await fetch(apiUrl('/knife'), {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    if (res.ok) {
        newKnife = { name: '', angle: '' };
        newKnifeImage = null;
        fetchKnives();
    } else {
        error = 'Failed to add knife';
    }
}

async function updateKnife() {
    error = '';
    const res = await fetch(apiUrl(`/knife/${editKnife.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editKnife),
        credentials: 'include'
    });
    if (res.ok) {
        editKnife = null;
        fetchKnives();
    } else {
        error = 'Failed to update knife';
    }
}

async function deleteKnife(id) {
    error = '';
    const res = await fetch(apiUrl(`/knife/${id}`), { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
        fetchKnives();
    } else {
        error = 'Failed to delete knife';
    }
}

function startEdit(knife) {
    editKnife = { ...knife };
}

function cancelEdit() {
    editKnife = null;
}

onMount(fetchKnives);
</script>

<h1>Knife Sharpening Log</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

<!-- Add Knife Form -->
<div class="form-section">
    <h2>Add Knife</h2>
    <input placeholder="Name" bind:value={newKnife.name} />
    <input placeholder="Angle" type="number" bind:value={newKnife.angle} />
    <input type="file" accept="image/*" on:change={e => newKnifeImage = e.target.files[0]} />
    <button on:click={addKnife}>Add</button>
</div>

<!-- Edit Knife Form -->
{#if editKnife}
    <div class="form-section">
        <h2>Edit Knife</h2>
        <input placeholder="Name" bind:value={editKnife.name} />
        <input placeholder="Angle" type="number" bind:value={editKnife.angle} />
        <input placeholder="Image Path (optional)" bind:value={editKnife.image_path} />
        <button on:click={updateKnife}>Save</button>
        <button on:click={cancelEdit}>Cancel</button>
    </div>
{/if}

<!-- Knife List -->
<h2>Knives</h2>
<div class="knife-list">
    {#each $knives as knife}
        <div class="knife-card">
            <div class="knife-header">
                <strong>{knife.name}</strong>
            </div>
            {#if knife.image_path}
                <div class="knife-image">
                    {#if knife.image_path.startsWith('s3://')}
                        <img src={knife.image_path.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com')} alt="knife image" width="80" />
                    {:else}
                        <img src={knife.image_path} alt="knife image" width="80" />
                    {/if}
                </div>
            {/if}
            <div class="knife-angle">Angle: {knife.angle}</div>
            <div class="knife-actions">
                <button on:click={() => startEdit(knife)}>Edit</button>
                <button on:click={() => deleteKnife(knife.id)}>Delete</button>
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
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    padding: 1.5em;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
