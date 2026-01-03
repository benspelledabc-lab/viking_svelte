<script lang="ts">
  import { resolve } from "$app/paths";
  import swagger from "$lib/images/viking_swagger_steampunk.png";
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl, swaggerUrl } from "$lib/api"; // <-- helper for global API base

  import { onMount } from "svelte";

  // Dynamic content
  let content: { paragraphs: string[] } | null = null;

  onMount(async () => {
    try {
      const res = await fetch("/toolkit.json");
      if (res.ok) {
        content = await res.json();
      }
    } catch (err) {
      console.error(err);
    }
  });
</script>

<svelte:head>
  <title>Toolkit</title>
  <meta name="description" content="Toolkit" />
</svelte:head>

<selection>
  {#if content}
    <!-- <h2>Svelte is pimptastic... ish.</h2> -->
    <h2>{content.title}</h2>

    <!-- Parent bubble wrapping all paragraphs -->
    <div class="p-bubble parent-bubble">
      {#each content.paragraphs as paragraph, i}
        <p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">
          {@html paragraph}
        </p>
      {/each}
    </div>
  {:else}
    <div class="table-container">
      <h2>My Lil Toolkit</h2>
      <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id
          cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla
          lacus nec metus. nunc posuere ut hendrerit semper vel class. Conubia
          nostra inceptos himenaeos orci varius natoque penatibus. Mus donec
          rhoncus eros lobortis nulla molestie mattis. Purus est efficitur
          laoreet mauris pharetra vestibulum fusce.
        </p>
        <!-- <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          Sodales consequat magna ante condimentum neque at luctus. Ligula
          congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo
          augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis
          fames primis vulputate ornare sagittis. Libero feugiat tristique
          accumsan maecenas potenti ultricies habitant.
        </p>
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex
          sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed
          diam urna tempor.
        </p> -->
      </div>

      <a href={swaggerUrl(`/swagger`)}>
        <img src={swagger} alt="Viking Swagger" width="400" height="300" />
      </a>
      <!-- <a href="https://api.spelledabc.org/swagger"><img src={swagger} alt="Viking Swagger" width="400" height="300" /></a> -->
    </div>
  {/if}
</selection>
