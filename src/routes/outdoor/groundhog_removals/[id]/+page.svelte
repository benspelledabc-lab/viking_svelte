<script>
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { apiUrl } from "$lib/api";
import { authStore } from "$lib/stores/auth";

let removal = null;
let editRemoval = null;
let error = '';
let successMessage = '';
let modalImageUrl = null;
let isEditMode = false;
let saving = false;

$: isAdminUser = $authStore.user?.role === 'admin' || $authStore.user?.role === 'superadmin';

async function fetchRemoval() {
    const id = $page.params.id;
    const res = await fetch(apiUrl(`/groundhog_removal/${id}`));
    if (res.ok) {
        removal = await res.json();
    } else {
        error = 'Failed to fetch groundhog removal';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
}

function formatDateForInput(dateStr) {
    if (!dateStr) return '';
    return dateStr.split('T')[0]; // Returns YYYY-MM-DD format
}

function openImageModal(imagePath) {
    if (imagePath.startsWith('s3://')) {
        modalImageUrl = imagePath.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com');
    } else {
        modalImageUrl = imagePath;
    }
}

function closeModal() {
    modalImageUrl = null;
}

function toggleEditMode() {
    if (isEditMode) {
        // Cancel edit
        editRemoval = null;
        isEditMode = false;
        error = '';
    } else {
        // Start edit
        editRemoval = { ...removal };
        // Format dates for input fields
        if (editRemoval.removal_date) {
            editRemoval.removal_date = formatDateForInput(editRemoval.removal_date);
        }
        // Ensure sex field has a value (handle null/undefined)
        if (!editRemoval.sex) {
            editRemoval.sex = "";
        }
        isEditMode = true;
    }
}

async function saveChanges() {
    saving = true;
    error = '';
    successMessage = '';

    try {
        const payload = {
            removal_date: editRemoval.removal_date,
            time_of_removal: editRemoval.time_of_removal,
            sex: editRemoval.sex,
            estimated_weight_lbs: editRemoval.estimated_weight_lbs ? parseFloat(editRemoval.estimated_weight_lbs) : null,
            shot_distance_yards: editRemoval.shot_distance_yards ? parseInt(editRemoval.shot_distance_yards) : null,
            excessive_wound_cavity: editRemoval.excessive_wound_cavity || false,
            firearm_id: editRemoval.firearm_id ? parseInt(editRemoval.firearm_id) : null,
            handload_id: editRemoval.handload_id ? parseInt(editRemoval.handload_id) : null,
            temperature: editRemoval.temperature ? parseFloat(editRemoval.temperature) : null,
            cloud_cover_percentage: editRemoval.cloud_cover_percentage ? parseInt(editRemoval.cloud_cover_percentage) : null,
            cloud_cover_description: editRemoval.cloud_cover_description,
            wind_speed_mph: editRemoval.wind_speed_mph ? parseInt(editRemoval.wind_speed_mph) : null,
            ambient_light_lux: editRemoval.ambient_light_lux,
            notes: editRemoval.notes
        };

        const res = await fetch(apiUrl(`/groundhog_removal/${removal.id}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            successMessage = 'Changes saved successfully!';
            isEditMode = false;
            editRemoval = null;
            await fetchRemoval();
            setTimeout(() => successMessage = '', 3000);
        } else {
            const errorData = await res.json();
            error = errorData.error || errorData.message || 'Failed to save changes';
        }
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to save changes';
    } finally {
        saving = false;
    }
}

onMount(fetchRemoval);
</script>

<svelte:head>
  <title>Groundhog Removal #{$page.params.id}</title>
  <meta name="description" content="Groundhog Removal Details" />
</svelte:head>

<div class="container">
    <div class="breadcrumb">
        <a href="/outdoor/groundhog_removals">← Back to All Removals</a>
    </div>

    {#if error}
        <div class="error">{error}</div>
    {/if}

    {#if successMessage}
        <div class="success">{successMessage}</div>
    {/if}

    {#if removal}
        <div class="p-bubble parent-bubble">
            <div class="header-with-edit">
                <h1>Groundhog Removal #{removal.id}</h1>
                
                {#if isAdminUser}
                    <div class="edit-controls">
                        {#if !isEditMode}
                            <button class="btn-edit" on:click={toggleEditMode}>
                                ✏️ Edit
                            </button>
                        {:else}
                            <button class="btn-save" on:click={saveChanges} disabled={saving}>
                                {saving ? '💾 Saving...' : '💾 Save'}
                            </button>
                            <button class="btn-cancel" on:click={toggleEditMode} disabled={saving}>
                                ❌ Cancel
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
            
            <div class="detail-grid">
                <div class="detail-section">
                    <h2>Basic Info</h2>
                    {#if isEditMode}
                        <div class="edit-field">
                            <label>Date:</label>
                            <input type="date" bind:value={editRemoval.removal_date} />
                        </div>
                        <div class="edit-field">
                            <label>Time:</label>
                            <input type="time" bind:value={editRemoval.time_of_removal} />
                        </div>
                        <div class="edit-field">
                            <label>Sex:</label>
                            <select bind:value={editRemoval.sex}>
                                <option value="Unknown">Unknown</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <!-- <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="male">male</option>
                                <option value="female">female</option> -->
                            </select>
                        </div>
                        <div class="edit-field">
                            <label>Weight (lbs):</label>
                            <input type="number" step="0.1" bind:value={editRemoval.estimated_weight_lbs} />
                        </div>
                        <div class="edit-field">
                            <label>Shot Distance (yards):</label>
                            <input type="number" bind:value={editRemoval.shot_distance_yards} />
                        </div>
                        <div class="edit-field checkbox-field">
                            <label>
                                <input type="checkbox" bind:checked={editRemoval.excessive_wound_cavity} />
                                Excessive Wound Cavity
                            </label>
                        </div>
                    {:else}
                        <div class="detail-row">
                            <span class="label">Date:</span>
                            <span>{formatDate(removal.removal_date)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Time:</span>
                            <span>{removal.time_of_removal || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Sex:</span>
                            <span>{removal.sex || 'unknown'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Weight:</span>
                            <span>{removal.estimated_weight_lbs || 'N/A'} lbs</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Shot Distance:</span>
                            <span>{removal.shot_distance_yards || 'N/A'} yards</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Excessive Wound Cavity:</span>
                            <span>{removal.excessive_wound_cavity ? 'Yes' : 'No'}</span>
                        </div>
                    {/if}
                </div>

                <div class="detail-section">
                    <h2>Weather Conditions</h2>
                    {#if isEditMode}
                        <div class="edit-field">
                            <label>Temperature (°F):</label>
                            <input type="number" step="0.1" bind:value={editRemoval.temperature} />
                        </div>
                        <div class="edit-field">
                            <label>Cloud Cover (%):</label>
                            <input type="number" min="0" max="100" bind:value={editRemoval.cloud_cover_percentage} />
                        </div>
                        <div class="edit-field">
                            <label>Cloud Description:</label>
                            <input type="text" bind:value={editRemoval.cloud_cover_description} />
                        </div>
                        <div class="edit-field">
                            <label>Wind Speed (mph):</label>
                            <input type="number" bind:value={editRemoval.wind_speed_mph} />
                        </div>
                        <div class="edit-field">
                            <label>Ambient Light:</label>
                            <input type="text" bind:value={editRemoval.ambient_light_lux} />
                        </div>
                    {:else}
                        <div class="detail-row">
                            <span class="label">Temperature:</span>
                            <span>{removal.temperature || 'N/A'}°F</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Cloud Cover:</span>
                            <span>{removal.cloud_cover_percentage !== null ? removal.cloud_cover_percentage + '%' : 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Cloud Description:</span>
                            <span>{removal.cloud_cover_description || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Wind Speed:</span>
                            <span>{removal.wind_speed_mph || 'N/A'} mph</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Ambient Light:</span>
                            <span>{removal.ambient_light_lux || 'N/A'}</span>
                        </div>
                    {/if}
                </div>

                <div class="detail-section">
                    <h2>Equipment</h2>
                    {#if isEditMode}
                        <div class="edit-field">
                            <label>Firearm ID:</label>
                            <input type="number" bind:value={editRemoval.firearm_id} />
                        </div>
                        <div class="edit-field">
                            <label>Handload ID:</label>
                            <input type="number" bind:value={editRemoval.handload_id} />
                        </div>
                    {:else}                    
                        <div class="detail-row">
                            <span class="label">Firearm:&nbsp;</span>&nbsp;
                            <span>
                                {#if removal.firearm}
                                    {removal.firearm.caliber} [{removal.firearm.make} {removal.firearm.model}]
                                {:else}
                                    N/A
                                {/if}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Handload:</span>
                            <span>
                                {#if removal.handload_id}
                                    <a href="/outdoor/handloads/{removal.handload_id}" class="handload-link">
                                        View Handload #{removal.handload_id}
                                    </a>
                                {:else}
                                    N/A
                                {/if}                            
                            </span>
                        </div>
                    {/if}                    
                </div>
            </div>

            <div class="notes-section">
                <h2>Notes</h2>
                {#if isEditMode}
                    <textarea bind:value={editRemoval.notes} rows="6"></textarea>
                {:else}
                    <p>
                        {#if removal.removal_date && new Date(removal.removal_date) < new Date('2026-06-01')}                                                  
                            <span class="legacy-notice">Entries before June 2026 default to my 22-250 and the handload for that rifle. I lost the actual info in the database migration mostly due to lazyness.</span>
                        {/if}
                    </p>
                    {#if removal.notes}
                        <p>{removal.notes}</p>
                    {:else}
                        <p class="no-notes">No notes available.</p>
                    {/if}
                {/if}
            </div>

            <div class="images-section">
                <h2>Images ({(removal.image_path ? 1 : 0) + (removal.images ? removal.images.length : 0)})</h2>
                <div class="images-grid">
                    <!-- Primary/Featured Image -->
                    {#if removal.image_path}
                        <div class="image-card">
                            <button class="image-thumbnail" on:click={() => openImageModal(removal.image_path)}>
                                {#if removal.image_path.startsWith('s3://')}
                                    <img 
                                        src={removal.image_path.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com')} 
                                        alt="Primary groundhog removal" 
                                    />
                                {:else}
                                    <img src={removal.image_path} alt="Primary groundhog removal" />
                                {/if}
                            </button>
                            <div class="image-label">Primary Image</div>
                        </div>
                    {/if}

                    <!-- Gallery Images -->
                    {#if removal.images && removal.images.length > 0}
                        {#each removal.images as image, idx}
                            <div class="image-card">
                                <button class="image-thumbnail" on:click={() => openImageModal(image.image_path)}>
                                    {#if image.image_path.startsWith('s3://')}
                                        <img 
                                            src={image.image_path.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com')} 
                                            alt="Gallery image {idx + 1}" 
                                        />
                                    {:else}
                                        <img src={image.image_path} alt="Gallery image {idx + 1}" />
                                    {/if}
                                </button>
                                <div class="image-label">
                                    {image.caption || `Gallery Image ${idx + 1}`}
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>

                {#if !removal.image_path && (!removal.images || removal.images.length === 0)}
                    <p class="no-images">No images available for this removal.</p>
                {/if}
            </div>
        </div>
    {:else if !error}
        <div class="p-bubble parent-bubble">
            <p>Loading...</p>
        </div>
    {/if}
</div>

<!-- Image Modal -->
{#if modalImageUrl}
    <div class="modal-overlay" on:click={closeModal}>
        <div class="modal-content" on:click|stopPropagation>
            <button class="close-btn" on:click={closeModal}>&times;</button>
            <img src={modalImageUrl} alt="Groundhog removal" />
        </div>
    </div>
{/if}

<style>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
}

.breadcrumb {
    margin-bottom: 1rem;
}

.breadcrumb a {
    color: #4CAF50;
    text-decoration: none;
    font-size: 1rem;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.p-bubble {
    padding: 2rem;
    margin: 1rem auto;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-with-edit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

h1 {
    margin: 0;
    color: #333;
}

h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #555;
    border-bottom: 2px solid #d2b48c;
    padding-bottom: 0.5rem;
}

.edit-controls {
    display: flex;
    gap: 0.5rem;
}

.btn-edit, .btn-save, .btn-cancel {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s;
}

.btn-edit {
    background: #ff9800;
    color: white;
}

.btn-edit:hover {
    background: #f57c00;
}

.btn-save {
    background: #4caf50;
    color: white;
}

.btn-save:hover:not(:disabled) {
    background: #45a049;
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-cancel {
    background: #757575;
    color: white;
}

.btn-cancel:hover:not(:disabled) {
    background: #616161;
}

.btn-cancel:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    background: rgba(244, 67, 54, 0.9);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.success {
    background: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.detail-section {
    background: rgba(255, 255, 255, 0.6);
    padding: 1.5rem;
    border-radius: 8px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
    border-bottom: none;
}

.label {
    font-weight: 600;
    color: #555;
}

.edit-field {
    margin-bottom: 1rem;
}

.edit-field label {
    display: block;
    font-weight: 600;
    color: #555;
    margin-bottom: 0.3rem;
}

.edit-field input,
.edit-field select {
    width: 100%;
    padding: 0.6rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 0.95rem;
}

.edit-field input:focus,
.edit-field select:focus {
    outline: none;
    border-color: #4caf50;
}

.checkbox-field {
    display: flex;
    align-items: center;
}

.checkbox-field label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    margin: 0;
}

.checkbox-field input[type="checkbox"] {
    width: auto;
    margin: 0;
}

.notes-section {
    background: rgba(255, 255, 255, 0.6);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.notes-section p {
    white-space: pre-wrap;
    line-height: 1.6;
}

.notes-section textarea {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
}

.notes-section textarea:focus {
    outline: none;
    border-color: #4caf50;
}

.no-notes {
    color: #999;
    font-style: italic;
}

.images-section {
    background: rgba(255, 255, 255, 0.6);
    padding: 1.5rem;
    border-radius: 8px;
}

.images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.image-card {
    text-align: center;
}

.image-thumbnail {
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
    border: 2px solid #d2b48c;
    background: #f5f5f5;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    padding: 0;
}

.image-thumbnail:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.image-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-label {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;
}

.no-images {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 2rem;
}

.error {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    background: white;
    padding: 1rem;
    border-radius: 8px;
}

.modal-content img {
    max-width: 100%;
    max-height: 80vh;
    display: block;
    margin: 0 auto;
}

.close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    z-index: 1001;
}

.close-btn:hover {
    background: #d32f2f;
}

.handload-link {
    color: #4CAF50;
    text-decoration: none;
    font-weight: 500;
}

.handload-link:hover {
    text-decoration: underline;
}

.legacy-notice {
    color: #d32f2f;
    font-weight: 600;
    display: block;
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .header-with-edit {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .edit-controls {
        width: 100%;
    }

    .btn-edit, .btn-save, .btn-cancel {
        flex: 1;
    }
}
</style>
