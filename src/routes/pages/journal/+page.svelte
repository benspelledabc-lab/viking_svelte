<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { apiRequest } from "$lib/api";
  import { authStore } from "$lib/stores/auth";
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
  import { fade } from "svelte/transition";

  let entries: any[] = [];
  let loading = true;
  let error: string | null = null;
  
  const ENTRIES_PER_PAGE = 3;
  let currentPage = 1;
  let totalPages = 1;
  let paginatedEntries: any[] = [];
  
  // Check if user is admin or superadmin
  $: isAdminUser = $authStore.user?.role === 'admin' || $authStore.user?.role === 'superadmin';

  // Get page from URL query parameter
  $: {
    const urlPage = $page.url.searchParams.get('page');
    currentPage = urlPage ? parseInt(urlPage) : 1;
    updatePaginatedEntries();
  }

  function updatePaginatedEntries() {
    const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
    const endIndex = startIndex + ENTRIES_PER_PAGE;
    paginatedEntries = entries.slice(startIndex, endIndex);
  }

  function goToPage(pageNum: number) {
    if (pageNum < 1 || pageNum > totalPages) return;
    goto(`/pages/journal?page=${pageNum}`);
  }

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onMount(async () => {
    loading = true;
    error = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      entries = await apiRequest('/journal_entries');
      totalPages = Math.ceil(entries.length / ENTRIES_PER_PAGE);
      updatePaginatedEntries();
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load journal entries";
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Journal Entries</title>
  <meta name="description" content="Browse journal entries" />
</svelte:head>

<div class="journal-container">
  <h1>Journal Entries</h1>

  {#if loading}
    <div in:fade class="spinner-container">
      <LoadingSpinner size={92} thickness={18} />
      <h2>Loading journal entries...</h2>
    </div>
  {:else if error}
    <div class="error-message">
      <p style="color:red;">Error: {error}</p>
    </div>
  {:else if entries.length === 0}
    <div class="no-entries">
      <p>No journal entries found.</p>
    </div>
  {:else}
    <div class="entries-list">
      {#each paginatedEntries as entry (entry.id)}
        <article class="journal-entry" in:fade>
          <div class="entry-header">
            <div class="title-row">
              <h2>{entry.topic}</h2>
              {#if isAdminUser}
                <a href={resolve(`/pages/toolbox/journal/edit/${entry.id}`)} class="edit-link">
                  ✏️ Edit
                </a>
              {/if}
            </div>
            <time class="entry-date">{formatDate(entry.dateEntered)}</time>
          </div>
          <div class="entry-body">
            {@html entry.body.replace(/\n/g, '<br>')}
          </div>
          {#if !entry.isViewable}
            <div class="private-badge">🔒 Private</div>
          {/if}
        </article>
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="pagination">
        <button 
          class="page-btn"
          disabled={currentPage === 1}
          on:click={() => goToPage(currentPage - 1)}
        >
          ← Previous
        </button>

        <div class="page-numbers">
          {#each Array(totalPages) as _, i}
            <button
              class="page-num"
              class:active={currentPage === i + 1}
              on:click={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          {/each}
        </div>

        <button 
          class="page-btn"
          disabled={currentPage === totalPages}
          on:click={() => goToPage(currentPage + 1)}
        >
          Next →
        </button>
      </div>

      <div class="page-info">
        Page {currentPage} of {totalPages} • Showing {paginatedEntries.length} of {entries.length} entries
      </div>
    {/if}
  {/if}
</div>

<style>
  .journal-container {
    max-width: 900px;
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

  .error-message,
  .no-entries {
    text-align: center;
    padding: 3rem 1rem;
    background: #f8f9fa;
    border: 2px dashed #ccc;
    border-radius: 8px;
    margin: 2rem 0;
  }

  .entries-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .journal-entry {
    background: white;
    border: 2px solid #d2b48c;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    position: relative;
  }

  .journal-entry:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .entry-header {
    margin-bottom: 1rem;
    border-bottom: 2px solid #e1dede;
    padding-bottom: 1rem;
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .entry-header h2 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.8rem;
    flex: 1;
  }

  .edit-link {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.8rem;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    transition: background 0.2s, transform 0.1s;
  }

  .edit-link:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  .entry-date {
    font-size: 0.9rem;
    color: #7f8c8d;
    font-style: italic;
  }

  .entry-body {
    line-height: 1.8;
    color: #2c3e50;
    font-size: 1rem;
    white-space: pre-wrap;
  }

  .private-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #e74c3c;
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0 1rem 0;
    flex-wrap: wrap;
  }

  .page-btn {
    padding: 0.6rem 1.2rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    font-size: 0.95rem;
  }

  .page-btn:hover:not(:disabled) {
    background: #2980b9;
    transform: translateY(-2px);
  }

  .page-btn:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .page-numbers {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-num {
    padding: 0.5rem 0.8rem;
    background: white;
    color: #2c3e50;
    border: 2px solid #d2b48c;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 40px;
  }

  .page-num:hover {
    background: #f0e6d6;
    border-color: #c0a070;
  }

  .page-num.active {
    background: #d2b48c;
    color: white;
    border-color: #d2b48c;
  }

  .page-info {
    text-align: center;
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  @media (max-width: 768px) {
    .journal-container {
      padding: 1rem 0.5rem;
    }

    h1 {
      font-size: 2rem;
    }

    .journal-entry {
      padding: 1.5rem;
    }

    .title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .entry-header h2 {
      font-size: 1.5rem;
    }

    .edit-link {
      font-size: 0.8rem;
      padding: 0.3rem 0.6rem;
    }

    .pagination {
      gap: 0.5rem;
    }

    .page-btn {
      padding: 0.5rem 0.8rem;
      font-size: 0.85rem;
    }

    .page-num {
      padding: 0.4rem 0.6rem;
      min-width: 35px;
    }
  }
</style>
