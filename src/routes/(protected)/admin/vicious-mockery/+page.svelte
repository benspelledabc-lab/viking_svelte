<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";

const insults = writable([]);

let newInsult = '';
let editInsult = null;
let error = '';
let successMessage = '';
let searchTerm = '';
let currentPage = 1;
let itemsPerPage = 10;

// Filter insults based on search term
$: filteredInsults = $insults.filter(insult => 
    insult.insult.toLowerCase().includes(searchTerm.toLowerCase())
);

// Reset to page 1 when search term changes
$: if (searchTerm !== undefined) {
    currentPage = 1;
}

$: totalPages = Math.ceil(filteredInsults.length / itemsPerPage);
$: paginatedInsults = filteredInsults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
);
$: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
    }
}

async function fetchInsults() {
    const res = await fetch(apiUrl('/vicious-mockery'));
    if (res.ok) {
        insults.set(await res.json());
        // Reset to page 1 when data is refreshed
        currentPage = 1;
    } else {
        error = 'Failed to fetch insults';
    }
}

async function addInsult() {
    error = '';
    successMessage = '';
    
    if (!newInsult.trim()) {
        error = 'Please enter an insult';
        setTimeout(() => error = '', 3000);
        return;
    }

    const res = await fetch(apiUrl('/vicious-mockery'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insult: newInsult }),
        credentials: 'include'
    });
    
    if (res.ok) {
        newInsult = '';
        successMessage = 'Insult added successfully!';
        fetchInsults();
        setTimeout(() => successMessage = '', 3000);
    } else {
        const errorData = await res.json();
        error = errorData.error || 'Failed to add insult';
    }
}

async function updateInsult() {
    error = '';
    successMessage = '';
    
    if (!editInsult.insult.trim()) {
        error = 'Please enter an insult';
        setTimeout(() => error = '', 3000);
        return;
    }

    const res = await fetch(apiUrl(`/vicious-mockery/${editInsult.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insult: editInsult.insult }),
        credentials: 'include'
    });
    
    if (res.ok) {
        editInsult = null;
        successMessage = 'Insult updated successfully!';
        fetchInsults();
        setTimeout(() => successMessage = '', 3000);
    } else {
        error = 'Failed to update insult';
    }
}

async function deleteInsult(id) {
    if (!confirm('Are you sure you want to delete this insult?')) {
        return;
    }
    
    error = '';
    successMessage = '';
    const res = await fetch(apiUrl(`/vicious-mockery/${id}`), { 
        method: 'DELETE', 
        credentials: 'include' 
    });
    
    if (res.ok) {
        successMessage = 'Insult deleted successfully!';
        fetchInsults();
        setTimeout(() => successMessage = '', 3000);
    } else {
        error = 'Failed to delete insult';
    }
}

function startEdit(insult) {
    editInsult = { ...insult };
}

function cancelEdit() {
    editInsult = null;
}

onMount(fetchInsults);
</script>

<h1>Vicious Mockery Insults</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

{#if successMessage}
    <div class="success">{successMessage}</div>
{/if}

<!-- Add Insult Form -->
<div class="form-section">
    <h2>Add Insult</h2>
    <div class="form-inline">
        <textarea 
            placeholder="Enter a vicious insult..." 
            bind:value={newInsult}
            rows="3"
        ></textarea>
        <button on:click={addInsult} class="btn-primary">Add</button>
    </div>
</div>

<!-- Edit Insult Form -->
{#if editInsult}
    <div class="form-section edit-form">
        <h2>Edit Insult #{editInsult.id}</h2>
        <div class="form-inline">
            <textarea 
                bind:value={editInsult.insult}
                rows="3"
            ></textarea>
            <div class="button-group">
                <button on:click={updateInsult} class="btn-primary">Save</button>
                <button on:click={cancelEdit} class="btn-secondary">Cancel</button>
            </div>
        </div>
    </div>
{/if}

<!-- Search Box -->
<div class="search-section">
    <input 
        type="text" 
        bind:value={searchTerm} 
        placeholder="Search insults..." 
        class="search-input"
    />
    {#if searchTerm}
        <button on:click={() => searchTerm = ''} class="clear-search">Clear</button>
    {/if}
</div>

{#if searchTerm && filteredInsults.length === 0}
    <div class="no-results">
        <p>No insults found matching "{searchTerm}"</p>
    </div>
{:else}
    <!-- Insult List -->
    <div class="list-header">
        <h2>Insults ({filteredInsults.length}{#if searchTerm} of {$insults.length}{/if})</h2>
        <div class="items-per-page">
        <label>Show:</label>
        <select bind:value={itemsPerPage} on:change={() => currentPage = 1}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
        </select>
        <span>per page</span>
    </div>
</div>

<div class="insult-list">
    {#each paginatedInsults as insult}
        <div class="insult-card">
            <div class="insult-id">#{insult.id}</div>
            <div class="insult-text">
                {insult.insult}
            </div>
            <div class="insult-actions">
                <button on:click={() => startEdit(insult)} class="btn-edit">Edit</button>
                <button on:click={() => deleteInsult(insult.id)} class="btn-delete">Delete</button>
            </div>
        </div>
    {/each}
</div>

{#if $insults.length === 0}
    <div class="no-data">
        <p>No insults yet. Add some vicious mockery!</p>
    </div>
{:else if filteredInsults.length > itemsPerPage}
    <!-- Pagination Controls -->
    <div class="pagination">
        <button 
            class="pagination-btn" 
            on:click={previousPage} 
            disabled={currentPage === 1}
        >
            ← Previous
        </button>
        
        <div class="page-numbers">
            {#if totalPages <= 7}
                {#each pageNumbers as pageNum}
                    <button 
                        class="page-btn" 
                        class:active={pageNum === currentPage}
                        on:click={() => goToPage(pageNum)}
                    >
                        {pageNum}
                    </button>
                {/each}
            {:else}
                <button 
                    class="page-btn" 
                    class:active={1 === currentPage}
                    on:click={() => goToPage(1)}
                >
                    1
                </button>
                
                {#if currentPage > 3}
                    <span class="ellipsis">...</span>
                {/if}
                
                {#each pageNumbers.filter(p => p > 1 && p < totalPages && Math.abs(p - currentPage) <= 1) as pageNum}
                    <button 
                        class="page-btn" 
                        class:active={pageNum === currentPage}
                        on:click={() => goToPage(pageNum)}
                    >
                        {pageNum}
                    </button>
                {/each}
                
                {#if currentPage < totalPages - 2}
                    <span class="ellipsis">...</span>
                {/if}
                
                <button 
                    class="page-btn" 
                    class:active={totalPages === currentPage}
                    on:click={() => goToPage(totalPages)}
                >
                    {totalPages}
                </button>
            {/if}
        </div>
        
        <button 
            class="pagination-btn" 
            on:click={nextPage} 
            disabled={currentPage === totalPages}
        >
            Next →
        </button>
    </div>
    
    <div class="pagination-info">
        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInsults.length)} of {filteredInsults.length} insults{#if searchTerm} (filtered from {$insults.length} total){/if}
    </div>
{/if}
{/if}

<style>
h1 {
    margin-bottom: 1em;
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    flex-wrap: wrap;
    gap: 1em;
}

.list-header h2 {
    margin: 0;
}

.items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 0.95em;
}

.items-per-page label {
    font-weight: 500;
}

.items-per-page select {
    padding: 0.4em 0.6em;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
}

.items-per-page select:focus {
    outline: none;
    border-color: #4a90e2;
}

.search-section {
    display: flex;
    gap: 0.5em;
    margin-bottom: 1.5em;
    align-items: center;
}

.search-input {
    flex: 1;
    padding: 0.8em 1em;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    font-size: 1em;
    transition: border-color 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #4a90e2;
}

.clear-search {
    padding: 0.8em 1.2em;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
}

.clear-search:hover {
    background: #4b5563;
}

.no-results {
    text-align: center;
    padding: 2rem 1rem;
    background: rgba(255, 243, 205, 0.4);
    border: 2px solid #f59e0b;
    border-radius: 8px;
    margin: 1rem 0;
    color: #92400e;
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

.form-inline {
    display: flex;
    gap: 0.5em;
    align-items: flex-start;
}

textarea { 
    flex: 1;
    padding: 0.6em;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.95em;
    font-family: inherit;
    resize: vertical;
    min-width: 300px;
}

textarea:focus {
    outline: none;
    border-color: #4a90e2;
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
    flex-direction: column;
    gap: 0.5em;
}

button {
    padding: 0.7em 1.5em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
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
    flex: 1;
}

.btn-edit:hover {
    background: #f57c00;
}

.btn-delete {
    background: #f44336;
    color: white;
    flex: 1;
}

.btn-delete:hover {
    background: #d32f2f;
}

.insult-list {
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin-top: 1em;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    padding: 1.5em;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.insult-card {
    background: #fafbfc;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    padding: 1.2em;
    display: flex;
    align-items: center;
    gap: 1em;
    transition: transform 0.2s, box-shadow 0.2s;
}

.insult-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.insult-id {
    font-weight: bold;
    color: #666;
    min-width: 40px;
    font-size: 0.9em;
}

.insult-text {
    flex: 1;
    color: #333;
    line-height: 1.5;
}

.insult-actions {
    display: flex;
    gap: 0.5em;
}

.no-data {
    text-align: center;
    padding: 3rem 1rem;
    background: rgba(255, 255, 255, 0.4);
    border: 2px dashed #ccc;
    border-radius: 8px;
    margin-top: 1rem;
    color: #666;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    margin-top: 2em;
    flex-wrap: wrap;
}

.pagination-btn {
    padding: 0.6em 1.2em;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    background: #357abd;
}

.pagination-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 0.3em;
    align-items: center;
}

.page-btn {
    padding: 0.5em 0.8em;
    background: white;
    color: #333;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
    min-width: 40px;
}

.page-btn:hover {
    background: #f3f4f6;
    border-color: #4a90e2;
}

.page-btn.active {
    background: #4a90e2;
    color: white;
    border-color: #4a90e2;
}

.ellipsis {
    color: #666;
    padding: 0 0.3em;
}

.pagination-info {
    text-align: center;
    margin-top: 1em;
    color: #666;
    font-size: 0.9em;
}

@media (max-width: 768px) {
    .list-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .insult-card {
        flex-direction: column;
        align-items: flex-start;
    }

    .insult-actions {
        width: 100%;
    }

    .btn-edit, .btn-delete {
        flex: 1;
    }

    .form-inline {
        flex-direction: column;
    }

    textarea {
        min-width: 100%;
    }

    .pagination {
        gap: 0.3em;
    }

    .pagination-btn {
        padding: 0.5em 0.8em;
        font-size: 0.9em;
    }

    .page-btn {
        min-width: 35px;
        padding: 0.4em 0.6em;
    }
}
</style>
