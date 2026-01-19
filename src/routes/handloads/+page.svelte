<script>
  import { onMount } from "svelte";
  import { apiUrl } from "$lib/api"; // <-- helper for global API base

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
    isMobile = window.innerWidth <= 480; // adjust threshold if needed
  }

  onMount(async () => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    try {
      // import { apiUrl } from "$lib/api"; // <-- helper for global API base
      const res = await fetch(apiUrl(`/handloads`));

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      handloads = await res.json();

      // lets sort by flask, not here...
      // handloads.sort((a, b) =>
      //   a.caliber.toLowerCase().localeCompare(b.caliber.toLowerCase()),
      // );
    } catch (err) {
      error = err.message;
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
            <th>Caliber</th>
            <th>Bullet Weight/Name</th>
          </tr>
        </thead>
        <tbody>
          {#each handloads as h}
            <tr>
              <td
                ><a
                  href={`/handloads/${h.id}`}
                  style="color: blue; text-decoration: underline;"
                  >{h.caliber}</a
                ></td
              >
              <td>{h.bullet_weight}gr - {h.bullet_name}</td>
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
        <!-- <th>Load #</th> -->
        <th>Caliber</th>
        <th>Bullet Weight/Name</th>
      </tr>
    </thead>
    <tbody>
      {#each handloads as h}
        <tr>
          <td
            ><a
              href={`/handloads/${h.id}`}
              style="color: blue; text-decoration: underline;">{h.caliber}</a
            ></td
          >
          <td>{h.bullet_weight}gr - {h.bullet_name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  /* Bubble styling */
  .bubble-table {
    padding: 1rem;
    margin: 1rem auto;
    border-radius: 1rem;
    background-color: #f7f3f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
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
</style>
