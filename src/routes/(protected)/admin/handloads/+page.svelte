<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const handloads = writable([]);
const firearms = writable([]);

let newHandload = { 
    firearm_id: '', 
    caliber: '', 
    bullet_name: '',
    bullet_weight: '', 
    coal: '', 
    powder_name: '', 
    powder_charge: '', 
    fps_avg: '', 
    fps_sd: '', 
    fps_es: '',
    is_ocw: false,
    path_to_grt: ''
};
let editHandload = null;
let error = '';
let successMessage = '';

async function fetchHandloads() {
    const res = await fetch(apiUrl('/handloads'));
    if (res.ok) {
        handloads.set(await res.json());
    } else {
        error = 'Failed to fetch handloads';
    }
}

async function fetchFirearms() {
    const res = await fetch(apiUrl('/firearms'));
    if (res.ok) {
        firearms.set(await res.json());
    } else {
        error = 'Failed to fetch firearms';
    }
}

async function addHandload() {
    error = '';
    successMessage = '';
    
    const payload = {
        firearm_id: parseInt(newHandload.firearm_id),
        caliber: newHandload.caliber,
        bullet_name: newHandload.bullet_name,
        bullet_weight: parseFloat(newHandload.bullet_weight),
        coal: parseFloat(newHandload.coal),
        powder_name: newHandload.powder_name,
        powder_charge: parseFloat(newHandload.powder_charge),
        fps_avg: parseFloat(newHandload.fps_avg),
        fps_sd: parseFloat(newHandload.fps_sd),
        fps_es: parseFloat(newHandload.fps_es),
        is_ocw: newHandload.is_ocw,
        path_to_grt: newHandload.path_to_grt
    };

    const res = await fetch(apiUrl('/handload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    });
    
    if (res.ok) {
        newHandload = { 
            firearm_id: '', 
            caliber: '', 
            bullet_name: '',
            bullet_weight: '', 
            coal: '', 
            powder_name: '', 
            powder_charge: '', 
            fps_avg: '', 
            fps_sd: '', 
            fps_es: '',
            is_ocw: false,
            path_to_grt: ''
        };
        successMessage = 'Handload added successfully!';
        fetchHandloads();
        setTimeout(() => successMessage = '', 3000);
    } else {
        const errorData = await res.json();
        error = errorData.message || 'Failed to add handload';
    }
}

async function updateHandload() {
    error = '';
    successMessage = '';
    
    const payload = {
        firearm_id: parseInt(editHandload.firearm_id),
        caliber: editHandload.caliber,
        bullet_name: editHandload.bullet_name,
        bullet_weight: parseFloat(editHandload.bullet_weight),
        coal: parseFloat(editHandload.coal),
        powder_name: editHandload.powder_name,
        powder_charge: parseFloat(editHandload.powder_charge),
        fps_avg: parseFloat(editHandload.fps_avg),
        fps_sd: parseFloat(editHandload.fps_sd),
        fps_es: parseFloat(editHandload.fps_es),
        is_ocw: editHandload.is_ocw,
        path_to_grt: editHandload.path_to_grt
    };

    const res = await fetch(apiUrl(`/handload/${editHandload.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    });
    
    if (res.ok) {
        editHandload = null;
        successMessage = 'Handload updated successfully!';
        fetchHandloads();
        setTimeout(() => successMessage = '', 3000);
    } else {
        error = 'Failed to update handload';
    }
}

async function deleteHandload(id) {
    if (!confirm('Are you sure you want to delete this handload?')) {
        return;
    }
    
    error = '';
    successMessage = '';
    const res = await fetch(apiUrl(`/handload/${id}`), { 
        method: 'DELETE', 
        credentials: 'include' 
    });
    
    if (res.ok) {
        successMessage = 'Handload deleted successfully!';
        fetchHandloads();
        setTimeout(() => successMessage = '', 3000);
    } else {
        error = 'Failed to delete handload';
    }
}

function startEdit(handload) {
    editHandload = { ...handload };
}

function cancelEdit() {
    editHandload = null;
}

function getFirearmName(firearmId) {
    const firearm = $firearms.find(f => f.id === firearmId);
    return firearm ? `${firearm.make} ${firearm.model} (${firearm.caliber})` : `ID: ${firearmId}`;
}

onMount(() => {
    fetchHandloads();
    fetchFirearms();
});
</script>

<h1>Handload Management</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

{#if successMessage}
    <div class="success">{successMessage}</div>
{/if}

<!-- Add Handload Form -->
<div class="form-section">
    <h2>Add Handload</h2>
    <div class="form-grid">
        <div class="form-group">
            <label>Firearm *</label>
            <select bind:value={newHandload.firearm_id}>
                <option value="">Select Firearm</option>
                {#each $firearms as firearm}
                    <option value={firearm.id}>
                        {firearm.make} {firearm.model} - {firearm.caliber}
                    </option>
                {/each}
            </select>
        </div>
        
        <div class="form-group">
            <label>Caliber *</label>
            <input placeholder="e.g., 308 Winchester" bind:value={newHandload.caliber} />
        </div>
        
        <div class="form-group">
            <label>Bullet Name</label>
            <input placeholder="e.g., Hornady ELD-M" bind:value={newHandload.bullet_name} />
        </div>
        
        <div class="form-group">
            <label>Bullet Weight (gr) *</label>
            <input placeholder="e.g., 168" type="number" step="0.1" bind:value={newHandload.bullet_weight} />
        </div>
        
        <div class="form-group">
            <label>COAL (in) *</label>
            <input placeholder="e.g., 2.810" type="number" step="0.001" bind:value={newHandload.coal} />
        </div>
        
        <div class="form-group">
            <label>Powder Name *</label>
            <input placeholder="e.g., H4350" bind:value={newHandload.powder_name} />
        </div>
        
        <div class="form-group">
            <label>Powder Charge (gr) *</label>
            <input placeholder="e.g., 41.5" type="number" step="0.1" bind:value={newHandload.powder_charge} />
        </div>
        
        <div class="form-group">
            <label>FPS Avg *</label>
            <input placeholder="e.g., 2710" type="number" bind:value={newHandload.fps_avg} />
        </div>
        
        <div class="form-group">
            <label>FPS SD *</label>
            <input placeholder="e.g., 9.2" type="number" step="0.1" bind:value={newHandload.fps_sd} />
        </div>
        
        <div class="form-group">
            <label>FPS ES *</label>
            <input placeholder="e.g., 24" type="number" bind:value={newHandload.fps_es} />
        </div>
        
        <div class="form-group">
            <label>Path to GRT</label>
            <input placeholder="Optional" bind:value={newHandload.path_to_grt} />
        </div>
        
        <div class="form-group checkbox-group">
            <label>
                <input type="checkbox" bind:checked={newHandload.is_ocw} />
                OCW Load
            </label>
        </div>
    </div>
    
    <button on:click={addHandload} class="btn-primary">Add Handload</button>
</div>

<!-- Edit Handload Form -->
{#if editHandload}
    <div class="form-section edit-form">
        <h2>Edit Handload</h2>
        <div class="form-grid">
            <div class="form-group">
                <label>Firearm *</label>
                <select bind:value={editHandload.firearm_id}>
                    <option value="">Select Firearm</option>
                    {#each $firearms as firearm}
                        <option value={firearm.id}>
                            {firearm.make} {firearm.model} - {firearm.caliber}
                        </option>
                    {/each}
                </select>
            </div>
            
            <div class="form-group">
                <label>Caliber *</label>
                <input bind:value={editHandload.caliber} />
            </div>
            
            <div class="form-group">
                <label>Bullet Name</label>
                <input bind:value={editHandload.bullet_name} />
            </div>
            
            <div class="form-group">
                <label>Bullet Weight (gr) *</label>
                <input type="number" step="0.1" bind:value={editHandload.bullet_weight} />
            </div>
            
            <div class="form-group">
                <label>COAL (in) *</label>
                <input type="number" step="0.001" bind:value={editHandload.coal} />
            </div>
            
            <div class="form-group">
                <label>Powder Name *</label>
                <input bind:value={editHandload.powder_name} />
            </div>
            
            <div class="form-group">
                <label>Powder Charge (gr) *</label>
                <input type="number" step="0.1" bind:value={editHandload.powder_charge} />
            </div>
            
            <div class="form-group">
                <label>FPS Avg *</label>
                <input type="number" bind:value={editHandload.fps_avg} />
            </div>
            
            <div class="form-group">
                <label>FPS SD *</label>
                <input type="number" step="0.1" bind:value={editHandload.fps_sd} />
            </div>
            
            <div class="form-group">
                <label>FPS ES *</label>
                <input type="number" bind:value={editHandload.fps_es} />
            </div>
            
            <div class="form-group">
                <label>Path to GRT</label>
                <input bind:value={editHandload.path_to_grt} />
            </div>
            
            <div class="form-group checkbox-group">
                <label>
                    <input type="checkbox" bind:checked={editHandload.is_ocw} />
                    OCW Load
                </label>
            </div>
        </div>
        
        <div class="button-group">
            <button on:click={updateHandload} class="btn-primary">Save Changes</button>
            <button on:click={cancelEdit} class="btn-secondary">Cancel</button>
        </div>
    </div>
{/if}

<!-- Handload List -->
<h2>Handloads ({$handloads.length})</h2>
<div class="handload-list">
    {#each $handloads as handload}
        <div class="handload-card">
            <div class="handload-header">
                <strong>{handload.caliber}</strong>
                {#if handload.is_ocw}
                    <span class="ocw-badge">OCW</span>
                {/if}
            </div>
            
            <div class="handload-details">
                <div class="detail-section">
                    <h4>Firearm</h4>
                    <p>{getFirearmName(handload.firearm_id)}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Bullet</h4>
                    <p>
                        {#if handload.bullet_name}
                            {handload.bullet_name} - {handload.bullet_weight}gr
                        {:else}
                            {handload.bullet_weight}gr
                        {/if}
                    </p>
                </div>
                
                <div class="detail-section">
                    <h4>Powder</h4>
                    <p>{handload.powder_name} - {handload.powder_charge}gr</p>
                </div>
                
                <div class="detail-row">
                    <span class="label">COAL:</span>
                    <span class="value">{handload.coal}"</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">Velocity:</span>
                    <span class="value">{handload.fps_avg} fps</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">SD:</span>
                    <span class="value">{handload.fps_sd}</span>
                </div>
                
                <div class="detail-row">
                    <span class="label">ES:</span>
                    <span class="value">{handload.fps_es}</span>
                </div>
                
                {#if handload.path_to_grt}
                    <div class="detail-row">
                        <span class="label">GRT Path:</span>
                        <span class="value small">{handload.path_to_grt}</span>
                    </div>
                {/if}
            </div>
            
            <div class="handload-actions">
                <button on:click={() => startEdit(handload)} class="btn-edit">Edit</button>
                <button on:click={() => deleteHandload(handload.id)} class="btn-delete">Delete</button>
            </div>
        </div>
    {/each}
</div>

<style>
h1 {
    margin-bottom: 1em;
}

.form-section { 
    margin-bottom: 2em;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    padding: 1.5em;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.6);
}

.edit-form {
    background: rgba(255, 240, 200, 0.5);
    border: 2px solid rgba(255, 200, 100, 0.8);
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1em;
    margin-bottom: 1em;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 500;
    margin-bottom: 0.3em;
    color: #333;
}

.checkbox-group {
    flex-direction: row;
    align-items: center;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
}

input, select { 
    padding: 0.6em;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.95em;
}

input[type="checkbox"] {
    width: auto;
    margin: 0;
}

.error { 
    color: #d32f2f; 
    background: rgba(255, 200, 200, 0.8);
    padding: 0.8em;
    border-radius: 4px;
    margin-bottom: 1em;
    border-left: 4px solid #d32f2f;
}

.success {
    color: #2e7d32;
    background: rgba(200, 255, 200, 0.8);
    padding: 0.8em;
    border-radius: 4px;
    margin-bottom: 1em;
    border-left: 4px solid #2e7d32;
}

.button-group {
    display: flex;
    gap: 0.5em;
    margin-top: 1em;
}

button {
    padding: 0.7em 1.5em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}

.btn-primary {
    background: #4a90e2;
    color: white;
}

.btn-primary:hover {
    background: #357abd;
}

.btn-secondary {
    background: #757575;
    color: white;
}

.btn-secondary:hover {
    background: #616161;
}

.btn-edit {
    background: #ff9800;
    color: white;
}

.btn-edit:hover {
    background: #f57c00;
}

.btn-delete {
    background: #f44336;
    color: white;
}

.btn-delete:hover {
    background: #d32f2f;
}

.handload-list {
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

.handload-card {
    background: #fafbfc;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    padding: 1.2em;
    min-width: 280px;
    max-width: 320px;
    display: flex;
    flex-direction: column;
}

.handload-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    font-size: 1.1em;
    color: #222;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5em;
}

.ocw-badge {
    background: #4caf50;
    color: white;
    padding: 0.2em 0.6em;
    border-radius: 12px;
    font-size: 0.75em;
    font-weight: bold;
}

.handload-details {
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    margin-bottom: 1em;
}

.detail-section {
    margin-bottom: 0.4em;
}

.detail-section h4 {
    margin: 0 0 0.2em 0;
    font-size: 0.85em;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-section p {
    margin: 0;
    font-size: 0.95em;
    color: #333;
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

.detail-row .value.small {
    font-size: 0.85em;
    word-break: break-all;
}

.handload-actions {
    margin-top: auto;
    display: flex;
    gap: 0.5em;
}
</style>
