<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { apiRequest } from "$lib/api";
  import { authStore } from "$lib/stores/auth";


  const latestEntry = writable(null);
  let error = '';


  async function fetchLatestEntry() {
    try {
      const data = await apiRequest(`/journal_entries`);
      let entry = null;
      if (Array.isArray(data) && data.length > 0) {
        if ($authStore.isLoggedIn) {
          entry = data[0];
        } else {
          entry = data.find(e => e.isViewable);
        }
      }
      if (entry) {
        latestEntry.set(entry);
        error = '';
      } else {
        latestEntry.set(null);
        error = 'No public journal entries found.';
      }
    } catch (e) {
      latestEntry.set(null);
      error = 'Could not load journal entry.';
    }
  }


  $: $authStore, fetchLatestEntry();
</script>


<div class="table-container">
  <h2>Latest Journal Entry</h2>
  {#if error}
    <div class="p-bubble parent-bubble"><div class="p-bubble child-bubble error">{error}</div></div>
  {:else}
    <div class="p-bubble parent-bubble">
      {#if $latestEntry}
        {#if !$authStore.isLoggedIn && !$latestEntry.isViewable}
          <div class="p-bubble child-bubble">
            <div><strong>Private Entry</strong></div>
            <div>The latest journal entry is private.</div>
          </div>
        {:else}
          <div class="p-bubble child-bubble">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong>{ $latestEntry.topic }</strong>
              <span class="journal-date">{ $latestEntry.dateEntered ? new Date($latestEntry.dateEntered).toLocaleString() : '' }</span>
            </div>
            <div class="journal-body" style="margin-top:0.7em;">{ $latestEntry.body }</div>
            <div class="journal-viewable">{ $latestEntry.isViewable ? 'Public' : 'Private' }</div>
          </div>
        {/if}
      {:else}
        <div class="p-bubble child-bubble">No journal entries found.</div>
      {/if}
    </div>
  {/if}
</div>

<style>
.journal-card {
  background: #fafbfc;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  padding: 1em 1.2em;
  min-width: 200px;
  max-width: 600px;
  margin: 1em auto;
}
.journal-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
}
.journal-date {
  font-size: 0.95em;
  color: #555;
}
.journal-body {
  margin: 0.5em 0;
  width: 100%;
  white-space: pre-wrap;
}
.journal-viewable {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 0.5em;
}
.error {
  color: red;
  margin: 1em 0;
}
</style>
