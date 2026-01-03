<svelte:head>
  <title>Handloads</title>
  <meta name="description" content="Handloads for me!" />
</svelte:head>

<script>
  import { onMount } from "svelte";

  let handloads = [];
  let loading = true;
  let error = null;

  // Track tooltip visibility for mobile taps
  let showCaliberTooltip = {};
  let showBulletTooltip = {};
  let showIdTooltip = {};

  // Detect small screen (mobile)
  let isMobile = false;

  function checkMobile() {
    isMobile = window.innerWidth <= 480; // adjust threshold as needed
  }

  onMount(async () => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    try {
      const res = await fetch("https://api.spelledabc.org/api/v1/handloads");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      handloads = await res.json();

      handloads.sort((a, b) =>
        a.caliber.toLowerCase().localeCompare(b.caliber.toLowerCase())
      );
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }

    return () => window.removeEventListener("resize", checkMobile);
  });
</script>

<style>
  /* Bubble container */
  .p-bubble.parent-bubble {
    background-color: #f9f5f0;
    border-radius: 12px;
    padding: 1rem;
    margin: 1rem auto;
    max-width: 900px;
  }

  .p-bubble.child-bubble {
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    color: #333;
  }

  .table-container {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    overflow-x: auto;
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

  th:nth-child(2),
  td:nth-child(2) { min-width: 120px; }
  th:nth-child(3),
  td:nth-child(3) { min-width: 150px; }

  thead tr { background-color: #d2b48c; color: #000; }

  tbody tr:nth-child(even) { background-color: #e1dede; }
  tbody tr:nth-child(odd)  { background-color: #fff; }
  tbody tr:hover { background-color: #f0e6d6; }

  /* Truncation only for mobile */
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
    background-color: rgba(0,0,0,0.85);
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
</style>

<!-- Mobile message remains exactly as before -->
{#if isMobile}
<div class="p-bubble parent-bubble">      
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      Some text has been shortened to fit. Tap or click to see the full value.
    </p>  
</div>
{/if}

<!-- Desktop table wrapped in bubble -->
{#if !isMobile}
<div class="p-bubble parent-bubble">
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Load #</th>
          <th>Caliber</th>
          <th>Bullet Weight/Name</th>
        </tr>
      </thead>
      <tbody>
        {#each handloads as h}
          <tr>
            <td>{h.id}</td>
            <td>{h.caliber}</td>
            <td>{h.bullet_weight}gr - {h.bullet_name}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
{/if}
