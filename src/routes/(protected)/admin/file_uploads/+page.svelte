<script lang="ts">
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { apiUrl } from "$lib/api";
import { authStore } from "$lib/stores/auth";

interface FileUpload {
    id: number;
    filename: string;
    originalFilename: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: number;
    uploadedAt: string;
    visibleBy: string[];
    description: string;
    isNsfw: boolean;
}

const files = writable<FileUpload[]>([]);

let newFile: { file: File | null; description: string; visibleBy: string[]; isNsfw: boolean } = { 
    file: null, 
    description: '', 
    visibleBy: ['superadmin'],
    isNsfw: false
};
let editFile: FileUpload | null = null;
let error = '';
let successMessage = '';

const ROLES = ['user', 'power_user', 'admin', 'superadmin'];

async function fetchFiles() {
    const res = await fetch(apiUrl('/file_uploads'), { credentials: 'include' });
    if (res.ok) {
        files.set(await res.json());
    } else {
        error = 'Failed to fetch files';
    }
}

async function uploadFile() {
    error = '';
    successMessage = '';
    
    if (!newFile.file) {
        error = 'Please select a file';
        return;
    }
    
    if (newFile.visibleBy.length === 0) {
        error = 'Please select at least one role';
        return;
    }
    
    const formData = new FormData();
    formData.append('file', newFile.file);
    formData.append('description', newFile.description);
    formData.append('visibleBy', newFile.visibleBy.join(','));
    formData.append('isNsfw', newFile.isNsfw.toString());
    
    const res = await fetch(apiUrl('/file_upload'), {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    
    if (res.ok) {
        successMessage = 'File uploaded successfully!';
        newFile = { file: null, description: '', visibleBy: ['superadmin'], isNsfw: false };
        // Reset file input
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput) fileInput.value = '';
        fetchFiles();
    } else {
        const data = await res.json();
        error = data.error || 'Failed to upload file';
    }
}

async function updateFile() {
    if (!editFile) return;
    
    error = '';
    const res = await fetch(apiUrl(`/file_upload/${editFile.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            description: editFile.description,
            visibleBy: editFile.visibleBy,
            isNsfw: editFile.isNsfw
        }),
        credentials: 'include'
    });
    
    if (res.ok) {
        editFile = null;
        fetchFiles();
    } else {
        error = 'Failed to update file';
    }
}

async function deleteFile(id: number) {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    error = '';
    const res = await fetch(apiUrl(`/file_upload/${id}`), { 
        method: 'DELETE', 
        credentials: 'include' 
    });
    
    if (res.ok) {
        fetchFiles();
    } else {
        error = 'Failed to delete file';
    }
}

function startEdit(file: FileUpload) {
    editFile = { ...file };
}

function cancelEdit() {
    editFile = null;
}

function toggleRole(role: string, isNew: boolean = true) {
    if (isNew) {
        const index = newFile.visibleBy.indexOf(role);
        if (index > -1) {
            newFile.visibleBy = newFile.visibleBy.filter((r: string) => r !== role);
        } else {
            newFile.visibleBy = [...newFile.visibleBy, role];
        }
    } else if (editFile) {
        const index = editFile.visibleBy.indexOf(role);
        if (index > -1) {
            editFile.visibleBy = editFile.visibleBy.filter((r: string) => r !== role);
        } else {
            editFile.visibleBy = [...editFile.visibleBy, role];
        }
    }
}

function formatFileSize(bytes: number): string {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getDownloadUrl(filePath: string): string {
    if (filePath.startsWith('s3://')) {
        return filePath.replace('s3://website-hosted-files', 'https://website-hosted-files.s3.amazonaws.com');
    }
    return filePath;
}

// Check if current user can delete files
$: canDelete = $authStore.user?.role === 'admin' || $authStore.user?.role === 'superadmin';

onMount(fetchFiles);
</script>

<h1>File Uploads</h1>

{#if error}
    <div class="error">{error}</div>
{/if}

{#if successMessage}
    <div class="success">{successMessage}</div>
{/if}

<!-- Upload File Form -->
<div class="form-section">
    <h2>Upload New File</h2>
    
    <label>
        Select File:
        <input 
            type="file" 
            on:change={(e) => {
                const target = e.target as HTMLInputElement;
                newFile.file = target.files?.[0] || null;
            }} 
        />
    </label>
    
    <label>
        Description (optional):
        <textarea 
            placeholder="Brief description of the file..." 
            bind:value={newFile.description} 
            rows="3"
        ></textarea>
    </label>
    
    <div class="visibility-section">
        <span class="visibility-label">Visible By (select at least one):</span>
        <div class="checkbox-group">
            {#each ROLES as role}
                <label class="checkbox-label">
                    <input 
                        type="checkbox" 
                        checked={newFile.visibleBy.includes(role)}
                        on:change={() => toggleRole(role, true)}
                    />
                    {role.replace('_', ' ')}
                </label>
            {/each}
        </div>
    </div>
    
    <div class="nsfw-section">
        <label class="checkbox-label">
            <input 
                type="checkbox" 
                bind:checked={newFile.isNsfw}
            />
            <span class="nsfw-label">🔞 NSFW (Not Safe For Work)</span>
        </label>
    </div>
    
    <button on:click={uploadFile} class="btn-primary">Upload File</button>
</div>

<!-- Edit File Form -->
{#if editFile}
    <div class="form-section edit-section">
        <h2>Edit File Metadata</h2>
        
        <div class="file-info">
            <strong>File:</strong> {editFile.originalFilename}
        </div>
        
        <label>
            Description:
            <textarea 
                bind:value={editFile.description} 
                rows="3"
            ></textarea>
        </label>
        
        <div class="visibility-section">
            <span class="visibility-label">Visible By:</span>
            <div class="checkbox-group">
                {#each ROLES as role}
                    <label class="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={editFile.visibleBy.includes(role)}
                            on:change={() => toggleRole(role, false)}
                        />
                        {role.replace('_', ' ')}
                    </label>
                {/each}
            </div>
        </div>
        
        <div class="nsfw-section">
            <label class="checkbox-label">
                <input 
                    type="checkbox" 
                    bind:checked={editFile.isNsfw}
                />
                <span class="nsfw-label">🔞 NSFW (Not Safe For Work)</span>
            </label>
        </div>
        
        <div class="button-group">
            <button on:click={updateFile} class="btn-primary">Save</button>
            <button on:click={cancelEdit} class="btn-secondary">Cancel</button>
        </div>
    </div>
{/if}

<!-- File List -->
<h2>Uploaded Files ({$files.length})</h2>
<div class="files-container">
    {#each $files as file}
        <div class="file-card">
            <div class="file-header">
                <strong>{file.originalFilename}</strong>
                {#if file.isNsfw}
                    <span class="nsfw-badge">🔞 NSFW</span>
                {/if}
            </div>
            
            <div class="file-meta">
                <div class="meta-item">
                    <span class="meta-label">Size:</span> {formatFileSize(file.fileSize)}
                </div>
                {#if file.mimeType}
                    <div class="meta-item">
                        <span class="meta-label">Type:</span> {file.mimeType}
                    </div>
                {/if}
                <div class="meta-item">
                    <span class="meta-label">Uploaded:</span> {new Date(file.uploadedAt).toLocaleDateString()}
                </div>
                <div class="meta-item">
                    <span class="meta-label">Visible to:</span> {file.visibleBy.join(', ').replace(/_/g, ' ')}
                </div>
                <div class="meta-item file-url">
                    <span class="meta-label">URL:</span> 
                    <input 
                        type="text" 
                        readonly 
                        value={getDownloadUrl(file.filePath)} 
                        on:click={(e) => e.target.select()}
                        class="url-input"
                    />
                </div>
                {#if file.description}
                    <div class="meta-item description">
                        {file.description}
                    </div>
                {/if}
            </div>
            
            <div class="file-actions">
                <a href={getDownloadUrl(file.filePath)} target="_blank" class="btn-link">Download</a>
                <button on:click={() => startEdit(file)}>Edit</button>
                {#if canDelete}
                    <button on:click={() => deleteFile(file.id)} class="btn-danger">Delete</button>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
.form-section {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5em;
    margin-bottom: 2em;
}

.edit-section {
    background: #fffbeb;
    border-color: #fbbf24;
}

label {
    display: block;
    margin-bottom: 1em;
    font-weight: 500;
}

.visibility-label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: 500;
}

input[type="file"],
textarea {
    display: block;
    width: 100%;
    margin-top: 0.5em;
    padding: 0.5em;
    border: 1px solid #d1d5db;
    border-radius: 4px;
}

.visibility-section {
    margin: 1em 0;
}

.checkbox-group {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    margin-top: 0.5em;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-weight: normal;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
}

.nsfw-section {
    margin: 1em 0;
    padding: 0.75em;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 4px;
}

.nsfw-label {
    font-weight: 600;
    color: #dc2626;
}

.nsfw-badge {
    background: #dc2626;
    color: white;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: 600;
}

.button-group {
    display: flex;
    gap: 0.5em;
}

button, .btn-link {
    padding: 0.5em 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95em;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-secondary:hover {
    background: #4b5563;
}

.btn-danger {
    background: #dc2626;
    color: white;
}

.btn-danger:hover {
    background: #b91c1c;
}

.btn-link {
    background: #059669;
    color: white;
    text-decoration: none;
    display: inline-block;
}

.btn-link:hover {
    background: #047857;
}

.error {
    color: #dc2626;
    background: #fee2e2;
    padding: 1em;
    border-radius: 4px;
    margin-bottom: 1em;
}

.success {
    color: #059669;
    background: #d1fae5;
    padding: 1em;
    border-radius: 4px;
    margin-bottom: 1em;
}

.file-info {
    margin-bottom: 1em;
    padding: 0.5em;
    background: white;
    border-radius: 4px;
}

.files-container {
    max-width: 1200px;
    margin: 1em auto;
    display: flex;
    flex-direction: column;
    gap: 1em;
}

.file-card {
    background: #fafbfc;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.file-header {
    font-size: 1.1em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5em;
}

.file-meta {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    font-size: 0.9em;
    color: #6b7280;
}

.meta-item {
    display: flex;
    gap: 0.5em;
}

.meta-label {
    font-weight: 500;
    color: #374151;
}

.meta-item.description {
    margin-top: 0.5em;
    padding: 0.5em;
    background: #f3f4f6;
    border-radius: 4px;
    color: #1f2937;
}

.meta-item.file-url {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    margin-top: 0.5em;
}

.url-input {
    width: 100%;
    padding: 0.4em 0.6em;
    font-size: 0.85em;
    font-family: monospace;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
}

.url-input:focus {
    outline: 2px solid #2563eb;
    background: white;
}

.file-actions {
    display: flex;
    gap: 0.5em;
    margin-top: 0.5em;
    padding-top: 0.5em;
    border-top: 1px solid #e5e7eb;
}

.file-actions button, 
.file-actions .btn-link {
    padding: 0.4em 0.8em;
    font-size: 0.9em;
}
</style>
