<script lang="ts">
  import Header from "./Header.svelte";
  import "./layout.css";
  import wallpaper from "$lib/images/viking-wallpaper.jpg";
  import api_image from "$lib/images/api.jpg";

  import { onMount } from "svelte";
  import { apiStatus, checkApiStatus } from "$lib/stores/apiStatus";

  let { children } = $props();
  let currentYear = new Date().getFullYear();

  onMount(() => {
    checkApiStatus();

    // refresh every 15 seconds
    const interval = setInterval(checkApiStatus, 15000);
    return () => clearInterval(interval);
  });
</script>

<div class="app" style="--wallpaper: url('{wallpaper}')">
  <Header />

  <main>
    {@render children()}
  </main>

  <footer>
    <!-- API Status Row -->
    <div class="api-status footer-bubble p-bubble">
      {#if $apiStatus === "checking"}
        <span class="status checking">
          <img
            src={api_image}
            alt="API Health: Checking"
            width="100"
            height="100"
            class="grayscale"
          />
          <span class="status-text">Checking</span>
        </span>
      {:else if $apiStatus === "online"}
        <span class="status online">
          <img
            src={api_image}
            alt="API Health: Online"
            width="100"
            height="100"
          />
          <span class="status-text">Online</span>
        </span>
      {:else if $apiStatus === "degraded"}
        <span class="status degraded">
          <img
            src={api_image}
            alt="API Health: Degraded"
            width="100"
            height="100"
          />
          <span class="status-text">Degraded</span>
        </span>
      {:else}
        <span class="status offline">
          <img
            src={api_image}
            alt="API Health: Offline"
            width="100"
            height="100"
            class="grayscale"
          />
          <span class="status-text">Offline</span>
        </span>
      {/if}
      <p>
        &copy;{currentYear} Irate Gnomes, Plundering Vikings &amp; Ben SpelledABC
      </p>
    </div>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    /* Wallpaper + gradient overlay */
    background-image: radial-gradient(
        50% 50% at 50% 50%,
        rgba(255, 255, 255, 0.55) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      var(--wallpaper);

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 90rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }

  /* API Status Styling */
  .api-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    opacity: 0.9;
    margin-top: 6px;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-text {
    font-weight: bold;
  }

  .status.online .status-text {
    color: #010101;
  }

  .status.offline .status-text {
    color: #f8f802;
  }

  .status.checking .status-text {
    color: #4c02f8;
  }

  .grayscale {
    filter: grayscale(100%);
  }
</style>
