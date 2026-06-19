<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { apiRequest } from "$lib/api";
  import { authStore } from "$lib/stores/auth";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { fade } from "svelte/transition";

  let entry: any = null;
  let loading = true;
  let saving = false;
  let error: string | null = null;
  let successMessage: string | null = null;

  // Form fields
  let topic = "";
  let body = "";
  let dateEntered = "";
  let isViewable = true;

  $: entry_id = $page.params.id;
  $: isAdminUser = $authStore.user?.role === 'admin' || $authStore.user?.role === 'superadmin';

  // Redirect if not admin
  $: if (!loading && !isAdminUser) {
    goto('/pages/journal');
  }

  function formatDateForInput(isoString: string): string {
    // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    saving = true;
    error = null;
    successMessage = null;

    try {
      // Convert datetime-local to ISO string
      const dateToSend = new Date(dateEntered).toISOString();

      const response = await apiRequest(`/journal_entry/${entry_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          topic,
          body,
          dateEntered: dateToSend,
          isViewable
        })
      });

      successMessage = "Journal entry updated successfully!";
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        goto('/pages/journal');
      }, 1500);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to update journal entry";
    } finally {
      saving = false;
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      return;
    }

    saving = true;
    error = null;

    try {
      await apiRequest(`/journal_entry/${entry_id}`, {
        method: 'DELETE'
      });

      goto('/pages/journal');
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to delete journal entry";
      saving = false;
    }
  }

  onMount(async () => {
    loading = true;
    error = null;

    try {
      entry = await apiRequest(`/journal_entry/${entry_id}`);
      
      // Populate form fields
      topic = entry.topic;
      body = entry.body;
      dateEntered = formatDateForInput(entry.dateEntered);
      isViewable = entry.isViewable;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load journal entry";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Edit Journal Entry</title>
</svelte:head>

<div class="edit-container">
  <h1>Edit Journal Entry</h1>

  {#if loading}
    <div in:fade class="spinner-container">
      <LoadingSpinner size={92} thickness={18} />
      <h2>Loading entry...</h2>
    </div>
  {:else if !isAdminUser}
    <div class="error-message">
      <p style="color:red;">Access denied. Admin privileges required.</p>
    </div>
  {:else if error && !entry}
    <div class="error-message">
      <p style="color:red;">Error: {error}</p>
      <button class="back-btn" on:click={() => goto('/pages/journal')}>
        ← Back to Journal
      </button>
    </div>
  {:else}
    <form on:submit={handleSubmit} class="edit-form">
      {#if successMessage}
        <div class="success-message" in:fade>
          ✓ {successMessage}
        </div>
      {/if}

      {#if error}
        <div class="error-message" in:fade>
          ✗ {error}
        </div>
      {/if}

      <div class="form-group">
        <label for="topic">Topic *</label>
        <input
          type="text"
          id="topic"
          bind:value={topic}
          required
          maxlength="120"
          placeholder="Enter topic"
        />
      </div>

      <div class="form-group">
        <label for="dateEntered">Date Entered *</label>
        <input
          type="datetime-local"
          id="dateEntered"
          bind:value={dateEntered}
          required
        />
      </div>

      <div class="form-group">
        <label for="body">Body *</label>
        <textarea
          id="body"
          bind:value={body}
          required
          rows="15"
          placeholder="Enter journal entry body"
        ></textarea>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            bind:checked={isViewable}
          />
          <span>Viewable to public</span>
        </label>
      </div>

      <div class="button-group">
        <button type="submit" class="save-btn" disabled={saving}>
          {#if saving}
            Saving...
          {:else}
            💾 Save Changes
          {/if}
        </button>

        <button type="button" class="cancel-btn" on:click={() => goto('/pages/journal')} disabled={saving}>
          Cancel
        </button>

        <button type="button" class="delete-btn" on:click={handleDelete} disabled={saving}>
          🗑️ Delete
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  .edit-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    font-size: 2.5rem;
  }

  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .edit-form {
    background: white;
    border: 2px solid #d2b48c;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
    font-size: 1rem;
  }

  .form-group input[type="text"],
  .form-group input[type="datetime-local"],
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #d2b48c;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3498db;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 300px;
    line-height: 1.6;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0;
  }

  .checkbox-group input[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  .checkbox-group span {
    font-weight: 600;
    color: #2c3e50;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .save-btn,
  .cancel-btn,
  .delete-btn,
  .back-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .save-btn {
    background: #27ae60;
    color: white;
    flex: 1;
  }

  .save-btn:hover:not(:disabled) {
    background: #229954;
    transform: translateY(-2px);
  }

  .save-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .cancel-btn {
    background: #95a5a6;
    color: white;
  }

  .cancel-btn:hover:not(:disabled) {
    background: #7f8c8d;
    transform: translateY(-2px);
  }

  .delete-btn {
    background: #e74c3c;
    color: white;
    margin-left: auto;
  }

  .delete-btn:hover:not(:disabled) {
    background: #c0392b;
    transform: translateY(-2px);
  }

  .back-btn {
    background: #3498db;
    color: white;
    margin-top: 1rem;
  }

  .back-btn:hover {
    background: #2980b9;
  }

  .success-message {
    background: #d4edda;
    border: 2px solid #28a745;
    color: #155724;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .error-message {
    background: #f8d7da;
    border: 2px solid #dc3545;
    color: #721c24;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  @media (max-width: 768px) {
    .edit-container {
      padding: 1rem 0.5rem;
    }

    h1 {
      font-size: 2rem;
    }

    .edit-form {
      padding: 1.5rem;
    }

    .button-group {
      flex-direction: column;
    }

    .delete-btn {
      margin-left: 0;
    }

    .form-group textarea {
      min-height: 200px;
    }
  }
</style>
