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
    isMobile = window.innerWidth <= 480; // adjust threshold if needed
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
  .table-container {
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }

  table {
    border-collapse: collapse;
    font-size: 0.85rem;
    margin: 0 auto;
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

{#if isMobile}
<div class="p-bubble parent-bubble">      
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      Some text has been shortened to fit. Tap or click to see the full value.
    </p>  
</div>
{:else}
<div class="p-bubble parent-bubble">  
    <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
      The text has NOT been shortened to fit because you're not registered as being on a mobile device.
    </p>  
</div>
{/if}      

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
          <!-- H-Id -->
          <td style="position: relative;">
            {#if isMobile}
              <span
                class="truncated"
                title={h.id}
                on:click={() => showIdTooltip[h.id] = !showIdTooltip[h.id]}
              >
                <a href={`/handloads/${h.id}`} style="color: blue; text-decoration: underline;">
                  {h.id}
                </a>
              </span>
              {#if showIdTooltip[h.id]}
                <div class="tooltip">{h.id}</div>
              {/if}
            {:else}
              <a href={`/handloads/${h.id}`} style="color: blue; text-decoration: underline;">
                {h.id}
              </a>
            {/if}
          </td>

          <!-- Caliber -->
          <td style="position: relative;">
            {#if isMobile}
              <span
                class="truncated"
                title={h.caliber}
                on:click={() => showCaliberTooltip[h.id] = !showCaliberTooltip[h.id]}
              >
                {h.caliber.slice(0, 12)}
              </span>
              {#if showCaliberTooltip[h.id]}
                <div class="tooltip">{h.caliber}</div>
              {/if}
            {:else}
              {h.caliber}
            {/if}
          </td>

          <!-- Bullet Weight/Name -->
          <td style="position: relative;">
            {#if isMobile}
              <span
                class="truncated"
                title={`${h.bullet_weight}gr - ${h.bullet_name}`}
                on:click={() => showBulletTooltip[h.id] = !showBulletTooltip[h.id]}
              >
                {h.bullet_weight}gr - {h.bullet_name.slice(0, 12)}
              </span>
              {#if showBulletTooltip[h.id]}
                <div class="tooltip">{h.bullet_weight}gr - {h.bullet_name}</div>
              {/if}
            {:else}
              {h.bullet_weight}gr - {h.bullet_name}
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
