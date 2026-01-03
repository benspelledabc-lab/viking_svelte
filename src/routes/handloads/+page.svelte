<svelte:head>
	<title>Handloads</title>
	<meta name="description" content="Handloads for me!" />
</svelte:head>

<script>
  import { onMount } from "svelte";

  let handloads = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      // https://api.spelledabc.org/api/v1/handloads
      const res = await fetch("https://api.spelledabc.org/api/v1/handloads");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      handloads = await res.json();
      
      handloads.sort((a, b) =>a.caliber.toLowerCase().localeCompare(b.caliber.toLowerCase()));

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>
<style>
  .table-container {
    width: 100%;
    margin: 0 auto;
    text-align: center; /* fallback for extra centering */
  }

  table {
    border-collapse: collapse;
    font-size: 0.85rem;
    margin: 0 auto; /* centers the table */
  }

  th, td {
    border: 1px solid #ccc;
    padding: 0.6rem 1rem;
    text-align: left;
    white-space: nowrap;
  }

  /* Min-width for key columns to prevent wrapping */
  th:nth-child(2), td:nth-child(2) { min-width: 120px; }  /* Caliber */
  th:nth-child(3), td:nth-child(3) { min-width: 150px; }  /* Make */
  th:nth-child(4), td:nth-child(4) { min-width: 150px; }  /* Model */

  thead tr {
    background-color: #d2b48c;
    color: #000;
  }

  tbody tr:nth-child(even) { background-color: #e1dede; }
  tbody tr:nth-child(odd) { background-color: #fff; }
  tbody tr:hover { background-color: #f0e6d6; }
</style>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Handload Id</th>
        <th>Is OCW</th>
        <th>Caliber</th>    
        <th>Bullet Name</th>    
        <th>Bullet Weight</th>    
        <th>Powder Name</th> 
      </tr>
    </thead>
    <tbody>
      {#each handloads as h}
        <tr>
          <td><a href={`/handloads/${h.id}`} style="color: blue; text-decoration: underline;">{h.id}</a></td>
          <td>{h.is_ocw}</td>
          <td>{h.caliber}</td>    
          <td>{h.bullet_name}</td>          
          <td>{h.bullet_weight}</td>          
          <td>{h.powder_name}</td>       
        </tr>
      {/each}
    </tbody>
  </table>
</div>