<script lang="ts">
  import { onMount } from "svelte";
  import { apiRequest } from "$lib/api"; // <-- helper with auth

  let handloads: any[] = [];
  let loading = true;
  let error: string | null = null;

  // Track tooltip visibility for mobile taps
  let showCaliberTooltip = {};
  let showBulletTooltip = {};
  let showIdTooltip = {};

  // Detect small screen (mobile)
  let isMobile = false;

  function checkMobile() {
    isMobile = window.innerWidth <= 480; // adjust threshold if needed
  }

  onMount(async () => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    try {
      handloads = await apiRequest(`/handloads`);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load handloads";
    } finally {
      loading = false;
    }

    return () => window.removeEventListener("resize", checkMobile);
  });
</script>

<svelte:head>
  <title>Handloads</title>
  <meta name="description" content="Handloads for me!" />
</svelte:head>

{#if isMobile}
  <h2>My handloads are not your handloads, use caution.</h2>
  <div class="p-bubble parent-bubble">
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      Some text has been shortened to fit. Tap or click to see the full value.
    </p>
  </div>
{/if}

<!-- Bubble wrapper for desktop -->
{#if !isMobile}
  <h2>My handloads are not your handloads, use caution.</h2>
  <div class="p-bubble parent-bubble bubble-table">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Caliber</th>
            <th>Bullet Weight</th>
          </tr>
        </thead>
        <tbody>
          {#each handloads as h}
            <tr>
              <td>{h.user_display_name || 'Unknown'}</td>
              <td
                ><a
                  href={`/outdoor/handloads/${h.id}`}
                  style="color: blue; text-decoration: underline;"
                  >{h.caliber}</a
                ></td
              >
              <td>{h.bullet_weight}gr</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

{#if isMobile}
  <table>
    <thead>
      <tr>
        <th>User</th>
        <th>Caliber</th>
        <th>Bullet Weight</th>
      </tr>
    </thead>
    <tbody>
      {#each handloads as h}
        <tr>
          <td>{h.user_display_name || 'Unknown'}</td>
          <td
            ><a
              href={`/outdoor/handloads/${h.id}`}
              style="color: blue; text-decoration: underline;">{h.caliber}</a
            ></td
          >
          <td>{h.bullet_weight}gr</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<!-- Database Schema Image -->
<div class="schema-section">
  {#if isMobile}
    <div class="p-bubble parent-bubble">
      <p class="p-bubble child-bubble">
        <strong>Needs Porting From Old Website:</strong><br/>
        <a 
          href="https://website-hosted-files.s3.amazonaws.com/imrunicorn/uploads/2026/06/641c1fce-a100-4bab-b60e-4042036603fe.png" 
          target="_blank" 
          rel="noopener noreferrer"
          style="color: blue; text-decoration: underline;"
        >
          View Database Schema
        </a>
      </p>
    </div>
  {:else}
    <h2>Needs Porting From Old Website</h2>
    <div class="p-bubble parent-bubble">
      <img 
        src="https://website-hosted-files.s3.amazonaws.com/imrunicorn/uploads/2026/06/641c1fce-a100-4bab-b60e-4042036603fe.png" 
        alt="Handloads Database Schema"
        class="schema-image"
      />
    </div>
  {/if}
</div>

<style>
  /* Bubble styling */
  .bubble-table {
    padding: 1rem;
    margin: 1rem auto;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .table-container {
    width: 100%;
    text-align: center;
  }

  table {
    border-collapse: collapse;
    font-size: 0.85rem;
    width: 100%;
    table-layout: auto;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 0.3rem 0.5rem;
    text-align: left;
    position: relative;
  }

  th:nth-child(1),
  td:nth-child(1) {
    min-width: 100px;
  }
  th:nth-child(2),
  td:nth-child(2) {
    min-width: 120px;
  }
  th:nth-child(3),
  td:nth-child(3) {
    min-width: 150px;
  }

  thead tr {
    background-color: #d2b48c;
    color: #000;
  }
  tbody tr:nth-child(even) {
    background-color: #e1dede;
  }
  tbody tr:nth-child(odd) {
    background-color: #fff;
  }
  tbody tr:hover {
    background-color: #f0e6d6;
  }

  /* Mobile truncation */
  .truncated {
    cursor: pointer;
    display: inline-block;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    z-index: 10;
    top: 100%;
    left: 0;
    white-space: nowrap;
    margin-top: 2px;
  }

  .schema-section {
    margin-top: 2rem;
  }

  .schema-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    display: block;
  }
</style>
