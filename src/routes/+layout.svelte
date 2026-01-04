<script lang="ts">
  import Header from "./Header.svelte";
  import "./layout.css";
  // import wallpaper from '$lib/images/anna-may_boobs.jpg'; // import your wallpaper
  import wallpaper from "$lib/images/viking-wallpaper.jpg"; // import your wallpaper

  let { children } = $props();
  let currentYear = new Date().getFullYear();
</script>

<div class="app" style="--wallpaper: url('{wallpaper}')">
  <Header />

  <main>
    {@render children()}
  </main>

  <footer>
    <p>
      &copy;{currentYear} Drunken Dwarves, Irate Gnomes, Plundering Vikings and Ben
      SpelledABC
    </p>
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
</style>
