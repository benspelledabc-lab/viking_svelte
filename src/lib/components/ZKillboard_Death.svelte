<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { apiRequest } from "$lib/api";

  export let characterID = 96399509;
  export let d = 4 * 60 * 60 * 1000; // 4 hours in ms
  
  // Global exported variables as writable stores
  export const killmail_id = writable<number | null>(null);
  export const locationID = writable<number | null>(null);
  export const totalValue = writable<number | null>(null);
  export const labels = writable<string[]>([]);
  
  // Store for all killmails
  export const killmails = writable<any[]>([]);

  // Helper function to format ISK value with short version
  function formatISK(value: number): string {
    const full = value.toLocaleString();
    let short = '';
    
    if (value >= 1_000_000_000) {
      short = `${(value / 1_000_000_000).toFixed(1)} bil`;
    } else if (value >= 1_000_000) {
      short = `${(value / 1_000_000).toFixed(1)} mil`;
    } else if (value >= 1_000) {
      short = `${(value / 1_000).toFixed(1)}k`;
    } else {
      return `${full} ISK`;
    }
    
    return `${full} ISK (${short})`;
  }

  // Helper function to extract ship name from kill page via Flask API
  async function fetchShipName(killmailId: number): Promise<{name: string, id: string | null, locationName: string | null, locationId: string | null}> {
    try {
      const data = await apiRequest(`/zkillboard/ship/${killmailId}`);
      return {
        name: data.ship_name || 'Unknown Ship',
        id: data.ship_id || null,
        locationName: data.location_name || null,
        locationId: data.location_id || null
      };
    } catch (e) {
      console.error(`Could not fetch ship name for killmail ${killmailId}:`, e);
      return {
        name: 'Unknown Ship',
        id: null,
        locationName: null,
        locationId: null
      };
    }
  }

  export async function fetchZKillboardDeaths() {
    try {
      const response = await fetch(`https://zkillboard.com/api/losses/characterID/${characterID}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        // Only take the first 2 most recent killmails
        const recentKills = data.slice(0, 2);
        
        // Fetch ship names for each killmail
        const enrichedData = await Promise.all(
          recentKills.map(async (kill) => {
            const shipData = await fetchShipName(kill.killmail_id);
            return {
              ...kill,
              shipName: shipData.name,
              shipId: shipData.id,
              locationName: shipData.locationName,
              locationId: shipData.locationId
            };
          })
        );
        
        killmails.set(enrichedData);
        
        // Set the most recent killmail data to the exported variables
        const latestKill = enrichedData[0];
        killmail_id.set(latestKill.killmail_id);
        locationID.set(latestKill.zkb.locationID);
        totalValue.set(latestKill.zkb.totalValue);
        labels.set(latestKill.zkb.labels || []);
      } else {
        killmails.set([]);
        killmail_id.set(null);
        locationID.set(null);
        totalValue.set(null);
        labels.set([]);
      }
    } catch (e) {
      console.error("Could not load zKillboard deaths:", e);
      killmails.set([]);
      killmail_id.set(null);
      locationID.set(null);
      totalValue.set(null);
      labels.set([]);
    }
  }

  let intervalId: ReturnType<typeof setInterval> | undefined;
  onMount(() => {
    fetchZKillboardDeaths();
    // Only set interval if d is a positive number
    if (typeof d === 'number' && d > 0) {
      intervalId = setInterval(fetchZKillboardDeaths, d);
      return () => clearInterval(intervalId);
    }
    return undefined;
  });
</script>

<div class="table-container">
  <h2>zKillboard Deaths</h2>
  <div class="p-bubble parent-bubble">
    {#if $killmails.length > 0}
      {#each $killmails as kill, i}
        <p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">
          <strong>Ship:</strong> 
          {#if kill.shipId}
            <a href="https://zkillboard.com/ship/{kill.shipId}/" target="_blank" rel="noopener noreferrer">{kill.shipName}</a>
          {:else}
            {kill.shipName}
          {/if}
          <br/>
          <strong>Total Value:</strong> {formatISK(kill.zkb.totalValue)}<br/>
          <strong>System:</strong> 
          {#if kill.locationName && kill.locationId}
            <a href="https://zkillboard.com/location/{kill.locationId}/" target="_blank" rel="noopener noreferrer">{kill.locationName}</a>
          {:else}
            Unknown
          {/if}
          <br/>
          <strong>Location:</strong> {kill.zkb.labels.find((label: string) => label.startsWith('loc:'))?.replace('loc:', '') || 'unknown'}<br/>
          <strong>Killmail ID:</strong> <a href="https://zkillboard.com/kill/{kill.killmail_id}/" target="_blank" rel="noopener noreferrer">{kill.killmail_id}</a>
        </p>
      {/each}
    {:else}
      <p class="p-bubble child-bubble">No killmails found.</p>
    {/if}
  </div>
</div>
