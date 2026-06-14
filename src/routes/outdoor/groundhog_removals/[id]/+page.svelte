<script>
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { apiUrl } from "$lib/api";

let removal = null;
let error = '';
let modalImageUrl = null;

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

    {#if removal}
        <div class="p-bubble parent-bubble">
            <h1>Groundhog Removal #{removal.id}</h1>
            
            <div class="detail-grid">
                <div class="detail-section">
                    <h2>Basic Info</h2>
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
                </div>

                <div class="detail-section">
                    <h2>Weather Conditions</h2>
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
                </div>

                <div class="detail-section">
                    <h2>Equipment</h2>
                    <div class="detail-row">
                        <span class="label">Firearm ID:</span>
                        <span>{removal.firearm_id || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Handload ID:</span>
                        <span>{removal.handload_id || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {#if removal.notes}
                <div class="notes-section">
                    <h2>Notes</h2>
                    <p>{removal.notes}</p>
                </div>
            {/if}

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

h1 {
    margin-bottom: 1.5rem;
    color: #333;
}

h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #555;
    border-bottom: 2px solid #d2b48c;
    padding-bottom: 0.5rem;
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
</style>
