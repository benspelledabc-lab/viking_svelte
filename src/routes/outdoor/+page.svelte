<script lang="ts">
  const outdoorLinks = [
    { href: "/outdoor/handloads/", label: "Handloads" },
    { href: "/outdoor/knives/", label: "Knife Sharpening Log" },
    { href: "/outdoor/groundhog_removals", label: "Groundhog Removals" }
  ];
</script>

<svelte:head>
  <title>Outdoor Sandbox</title>
  <meta name="description" content="Outdoor elements." />
</svelte:head>

<section class="table-container">
  <div class="p-bubble parent-bubble">
    <h2>You really shouldn't be here, but in case you are, pick from a link below.</h2>
    <nav aria-label="Outdoor navigation" class="p-bubble child-bubble">
      <ul class="outdoor-links">
        {#each outdoorLinks as { href, label }}
          <li>
            <a href={href}>{label}</a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</section>

<style>
  .outdoor-links {
    margin: 0;
    padding-left: 1.25rem;
    text-align: left;
    line-height: 1.8;
  }
</style>
