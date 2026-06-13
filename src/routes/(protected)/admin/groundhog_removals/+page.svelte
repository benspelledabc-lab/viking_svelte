<script>
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const removals = writable([]);

let newRemoval = {
    firearm_id: 50,
    handload_id: 51,
    removal_date: '',
    time_of_removal: '',
    estimated_weight_lbs: 10.5,
    excessive_wound_cavity: false,
    shot_distance_yards: 250,
    sex: 'unknown',
    notes: '',
    image_path: '',
    temperature: 74,
    cloud_cover_description: 'Clear',
    cloud_cover_percentage: 0,
    wind_speed_mph: 5,
    ambient_light_lux: 'West'
};

let newRemovalImage = null;
let editRemovalImage = null;
let editRemoval = null;
let error = '';
let success = '';

async function fetchRemovals() {
    const res = await fetch(apiUrl('/groundhog_removals'));
    if (res.ok) {
        removals.set(await res.json());
    } else {
        error = 'Failed to fetch groundhog removals';
    }
}

async function addRemoval() {
    error = '';
    success = '';
    
    // Use FormData to support file upload
    const formData = new FormData();
    
    // Add all non-empty fields to FormData
    Object.keys(newRemoval).forEach(key => {
        const value = newRemoval[key];
        if (value !== '' && value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });
    
    // Add image file if selected
    if (newRemovalImage) {
        formData.append('image', newRemovalImage);
    }
    
    const res = await fetch(apiUrl('/groundhog_removal'), {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    
    if (res.ok) {
        success = 'Groundhog removal added successfully!';
        // Reset form
        newRemoval = {
            firearm_id: 50,
            handload_id: 51,
            removal_date: '',
            time_of_removal: '',
            estimated_weight_lbs: 10.5,
            excessive_wound_cavity: false,
            shot_distance_yards: 250,
            sex: 'unknown',
            notes: '',
            image_path: '',
            temperature: 74,
            cloud_cover_description: 'Clear',
            cloud_cover_percentage: 0,
            wind_speed_mph: 5,
            ambient_light_lux: 'West'
        };
        newRemovalImage = null;
        fetchRemovals();
    } else {
        const data = await res.json();
        error = data.error || 'Failed to add groundhog removal';
    }
}

async function updateRemoval() {
    error = '';
    success = '';
    
    let body, headers = {};
    
    // Use FormData if an image file is selected
    if (editRemovalImage) {
        const formData = new FormData();
        
        // Append all fields
        Object.keys(editRemoval).forEach(key => {
            if (editRemoval[key] !== null && editRemoval[key] !== undefined && editRemoval[key] !== '') {
                formData.append(key, editRemoval[key]);
            }
        });
        
        // Append the image file
        formData.append('image', editRemovalImage);
        body = formData;
        // Don't set Content-Type header - browser will set it with boundary
    } else {
        // Use JSON for updates without file
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(editRemoval);
    }
    
    const res = await fetch(apiUrl(`/groundhog_removal/${editRemoval.id}`), {
        method: 'PUT',
        headers: headers,
        body: body,
        credentials: 'include'
    });
    
    if (res.ok) {
        success = 'Groundhog removal updated successfully!';
        editRemoval = null;
        editRemovalImage = null;
        fetchRemovals();
    } else {
        error = 'Failed to update groundhog removal';
    }
}

async function deleteRemoval(id) {
    if (!confirm('Are you sure you want to delete this removal? This will also delete all associated images.')) {
        return;
    }
    
    error = '';
    success = '';
    const res = await fetch(apiUrl(`/groundhog_removal/${id}`), {
        method: 'DELETE',
        credentials: 'include'
    });
    
    if (res.ok) {
        success = 'Groundhog removal deleted successfully!';
        fetchRemovals();
    } else {
        error = 'Failed to delete groundhog removal';
    }
}

function startEdit(removal) {
    editRemoval = { ...removal };
}

function cancelEdit() {
    editRemoval = null;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
}

onMount(fetchRemovals);
</script>

<svelte:head>
    <title>Groundhog Removals Admin</title>
</svelte:head>

<h1>Groundhog Removals Management</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

{#if success}
    <div class="success">{success}</div>
{/if}

<!-- Add Removal Form -->
<div class="form-section">
    <h2>Add New Groundhog Removal</h2>
    
    <div class="form-grid">
        <div class="form-group">
            <label>Date</label>
            <input type="date" bind:value={newRemoval.removal_date} />
        </div>
        
        <div class="form-group">
            <label>Time (HH:MM:SS)</label>
            <input type="time" step="1" bind:value={newRemoval.time_of_removal} />
        </div>
        
        <div class="form-group">
            <label>Firearm ID</label>
            <input type="number" bind:value={newRemoval.firearm_id} />
        </div>
        
        <div class="form-group">
            <label>Handload ID</label>
            <input type="number" bind:value={newRemoval.handload_id} />
        </div>
        
        <div class="form-group">
            <label>Weight (lbs)</label>
            <input type="number" step="0.01" bind:value={newRemoval.estimated_weight_lbs} placeholder="10.25" />
        </div>
        
        <div class="form-group">
            <label>Shot Distance (yards)</label>
            <input type="number" bind:value={newRemoval.shot_distance_yards} placeholder="250" />
        </div>
        
        <div class="form-group">
            <label>Sex</label>
            <select bind:value={newRemoval.sex}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
            </select>
        </div>
        
        <div class="form-group checkbox-group">
            <label>
                <input type="checkbox" bind:checked={newRemoval.excessive_wound_cavity} />
                Excessive Wound Cavity
            </label>
        </div>
        
        <div class="form-group">
            <label>Temperature (°F)</label>
            <input type="number" bind:value={newRemoval.temperature} placeholder="74" />
        </div>
        
        <div class="form-group">
            <label>Cloud Cover %</label>
            <input type="number" min="0" max="100" bind:value={newRemoval.cloud_cover_percentage} placeholder="50" />
        </div>
        
        <div class="form-group">
            <label>Wind Speed (mph)</label>
            <input type="number" bind:value={newRemoval.wind_speed_mph} placeholder="10" />
        </div>
        
        <div class="form-group">
            <label>Ambient Light/Direction</label>
            <input type="text" bind:value={newRemoval.ambient_light_lux} placeholder="West-North-West" />
        </div>
    </div>
    
    <div class="form-group full-width">
        <label>Cloud Cover Description</label>
        <input type="text" bind:value={newRemoval.cloud_cover_description} placeholder="Partly cloudy" />
    </div>
    
    <div class="form-group full-width">
        <label>Upload Image</label>
        <input type="file" accept="image/*" on:change={e => newRemovalImage = e.target.files[0]} />
        <small style="color: #666; display: block; margin-top: 0.3em;">
            Upload an image file to automatically save to S3, or provide an S3/URL path below
        </small>
    </div>
    
    <div class="form-group full-width">
        <label>Or Manual Image Path (S3 or URL)</label>
        <input type="text" bind:value={newRemoval.image_path} placeholder="s3://bucket/key or https://..." />
    </div>
    
    <div class="form-group full-width">
        <label>Notes</label>
        <textarea bind:value={newRemoval.notes} rows="4" placeholder="Additional notes..."></textarea>
    </div>
    
    <button class="btn-primary" on:click={addRemoval}>Add Removal</button>
</div>

<!-- Edit Removal Form -->
{#if editRemoval}
    <div class="form-section edit-section">
        <h2>Edit Groundhog Removal #{editRemoval.id}</h2>
        
        <div class="form-grid">
            <div class="form-group">
                <label>Date</label>
                <input type="date" bind:value={editRemoval.removal_date} />
            </div>
            
            <div class="form-group">
                <label>Time (HH:MM:SS)</label>
                <input type="time" step="1" bind:value={editRemoval.time_of_removal} />
            </div>
            
            <div class="form-group">
                <label>Firearm ID</label>
                <input type="number" bind:value={editRemoval.firearm_id} />
            </div>
            
            <div class="form-group">
                <label>Handload ID</label>
                <input type="number" bind:value={editRemoval.handload_id} />
            </div>
            
            <div class="form-group">
                <label>Weight (lbs)</label>
                <input type="number" step="0.01" bind:value={editRemoval.estimated_weight_lbs} />
            </div>
            
            <div class="form-group">
                <label>Shot Distance (yards)</label>
                <input type="number" bind:value={editRemoval.shot_distance_yards} />
            </div>
            
            <div class="form-group">
                <label>Sex</label>
                <select bind:value={editRemoval.sex}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                </select>
            </div>
            
            <div class="form-group checkbox-group">
                <label>
                    <input type="checkbox" bind:checked={editRemoval.excessive_wound_cavity} />
                    Excessive Wound Cavity
                </label>
            </div>
            
            <div class="form-group">
                <label>Temperature (°F)</label>
                <input type="number" bind:value={editRemoval.temperature} />
            </div>
            
            <div class="form-group">
                <label>Cloud Cover %</label>
                <input type="number" min="0" max="100" bind:value={editRemoval.cloud_cover_percentage} />
            </div>
            
            <div class="form-group">
                <label>Wind Speed (mph)</label>
                <input type="number" bind:value={editRemoval.wind_speed_mph} />
            </div>
            
            <div class="form-group">
                <label>Ambient Light/Direction</label>
                <input type="text" bind:value={editRemoval.ambient_light_lux} />
            </div>
        </div>
        
        <div class="form-group full-width">
            <label>Cloud Cover Description</label>
            <input type="text" bind:value={editRemoval.cloud_cover_description} />
        </div>
        
        <div class="form-group full-width">
            <label>Upload New Image</label>
            <input type="file" accept="image/*" on:change={e => editRemovalImage = e.target.files[0]} />
            <small style="color: #666; display: block; margin-top: 0.3em;">
                Upload a new image file to replace the current one, or edit the path below
            </small>
        </div>
        
        <div class="form-group full-width">
            <label>Or Manual Image Path</label>
            <input type="text" bind:value={editRemoval.image_path} />
        </div>
        
        <div class="form-group full-width">
            <label>Notes</label>
            <textarea bind:value={editRemoval.notes} rows="4"></textarea>
        </div>
        
        <div class="button-group">
            <button class="btn-primary" on:click={updateRemoval}>Save Changes</button>
            <button class="btn-secondary" on:click={cancelEdit}>Cancel</button>
        </div>
    </div>
{/if}

<!-- Removals List -->
<h2>All Groundhog Removals ({$removals.length})</h2>
<div class="removals-list">
    {#each $removals as removal}
        <div class="removal-card">
            <div class="removal-header">
                <strong>ID: {removal.id}</strong>
                <span class="date">{formatDate(removal.removal_date)}</span>
            </div>
            
            {#if removal.image_path}
                <div class="removal-image">
                    {#if removal.image_path.startsWith('s3://')}
                        <img 
                            src={removal.image_path.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com')} 
                            alt="groundhog removal" 
                            width="120"
                        />
                    {:else}
                        <img src={removal.image_path} alt="groundhog removal" width="120" />
                    {/if}
                </div>
            {/if}
            
            <div class="removal-details">
                <div class="detail-row">
                    <span class="label">Weight:</span>
                    <span>{removal.estimated_weight_lbs || 'N/A'} lbs</span>
                </div>
                <div class="detail-row">
                    <span class="label">Distance:</span>
                    <span>{removal.shot_distance_yards || 'N/A'} yards</span>
                </div>
                <div class="detail-row">
                    <span class="label">Sex:</span>
                    <span>{removal.sex || 'unknown'}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Time:</span>
                    <span>{removal.time_of_removal || 'N/A'}</span>
                </div>
                {#if removal.temperature}
                    <div class="detail-row">
                        <span class="label">Temp:</span>
                        <span>{removal.temperature}°F</span>
                    </div>
                {/if}
                {#if removal.excessive_wound_cavity}
                    <div class="badge">Excessive Wound Cavity</div>
                {/if}
                {#if removal.notes}
                    <div class="notes">{removal.notes}</div>
                {/if}
                {#if removal.images && removal.images.length > 0}
                    <div class="detail-row">
                        <span class="label">Gallery:</span>
                        <span>{removal.images.length} image(s)</span>
                    </div>
                {/if}
            </div>
            
            <div class="removal-actions">
                <button class="btn-edit" on:click={() => startEdit(removal)}>Edit</button>
                <button class="btn-delete" on:click={() => deleteRemoval(removal.id)}>Delete</button>
            </div>
        </div>
    {/each}
</div>

<style>
.error {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 1em;
    border-radius: 4px;
    margin-bottom: 1em;
}

.success {
    background: #efe;
    border: 1px solid #cfc;
    color: #3c3;
    padding: 1em;
    border-radius: 4px;
    margin-bottom: 1em;
}

.form-section {
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    padding: 1.5em;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 2em;
}

.edit-section {
    background: rgba(255, 250, 200, 0.5);
    border: 2px solid rgba(255, 200, 100, 0.6);
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1em;
    margin-bottom: 1em;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group label {
    font-weight: 600;
    margin-bottom: 0.3em;
    font-size: 0.9em;
    color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.6em;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
}

.form-group textarea {
    resize: vertical;
    font-family: inherit;
}

.checkbox-group {
    flex-direction: row;
    align-items: center;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin: 0;
}

.checkbox-group input[type="checkbox"] {
    width: auto;
    margin: 0;
}

.button-group {
    display: flex;
    gap: 1em;
    margin-top: 1em;
}

button {
    padding: 0.7em 1.5em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: all 0.2s;
}

.btn-primary {
    background: #4CAF50;
    color: white;
}

.btn-primary:hover {
    background: #45a049;
}

.btn-secondary {
    background: #888;
    color: white;
}

.btn-secondary:hover {
    background: #666;
}

.btn-edit {
    background: #2196F3;
    color: white;
}

.btn-edit:hover {
    background: #0b7dda;
}

.btn-delete {
    background: #f44336;
    color: white;
}

.btn-delete:hover {
    background: #da190b;
}

.removals-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5em;
    margin-top: 1em;
}

.removal-card {
    background: #fafbfc;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    padding: 1.2em;
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.removal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #e5e7eb;
}

.removal-header strong {
    font-size: 1.1em;
    color: #1f2937;
}

.removal-header .date {
    font-size: 0.9em;
    color: #6b7280;
}

.removal-image {
    text-align: center;
}

.removal-image img {
    border-radius: 6px;
    border: 1px solid #ccc;
    max-width: 100%;
    height: auto;
}

.removal-details {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95em;
}

.detail-row .label {
    font-weight: 600;
    color: #4b5563;
}

.badge {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    color: #92400e;
    padding: 0.3em 0.6em;
    border-radius: 4px;
    font-size: 0.85em;
    text-align: center;
}

.notes {
    font-size: 0.9em;
    color: #555;
    font-style: italic;
    padding: 0.5em;
    background: #f9fafb;
    border-radius: 4px;
    border-left: 3px solid #d1d5db;
}

.removal-actions {
    display: flex;
    gap: 0.5em;
    padding-top: 0.5em;
    border-top: 1px solid #e5e7eb;
}

.removal-actions button {
    flex: 1;
    padding: 0.6em;
    font-size: 0.9em;
}

h1 {
    margin-bottom: 1em;
}

h2 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
}
</style>
