<script lang="ts">
  let page = null; // stores the page object
  let loading = true;
  let error = null;
  import { apiUrl } from "$lib/api"; // <-- helper for global API base

  import { onMount } from "svelte";

  // Dynamic content
  let content: { paragraphs: string[] } | null = null;

  onMount(async () => {
    try {
      const res = await fetch("/about.json");
      if (res.ok) {
        content = await res.json();
      }
    } catch (err) {
      console.error(err);
    }
  });
</script>

<selection>
  {#if content}
    <!-- <h2>Svelte is pimptastic... ish.</h2> -->
    <h2>{content.title}</h2>

    <!-- Parent bubble wrapping all paragraphs -->
    <div class="p-bubble parent-bubble">
      {#each content.paragraphs as paragraph, i}
        <p class="p-bubble child-bubble" style="animation-delay: {i * 0.2}s">
          <!-- Parsed as HTML -->
          {@html paragraph}
        </p>
      {/each}
    </div>
  {:else}
    <div class="table-container">
      <h2>Static About Page Header</h2>
      <div class="p-bubble parent-bubble">
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          Sample text.... (about)
        </p>
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id
          cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla
          lacus nec metus.
        </p>
        <p class="p-bubble child-bubble" style="animation-delay: {3 * 0.2}s">
          nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos
          himenaeos orci varius natoque penatibus. Mus donec rhoncus eros
          lobortis nulla molestie mattis. Purus est efficitur laoreet mauris
          pharetra vestibulum fusce. Sodales consequat magna ante condimentum
          neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt
          nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras
          eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat
          tristique accumsan maecenas potenti ultricies habitant. Cubilia curae
          hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae
          pellentesque sem placerat in. Tempus leo eu aenean sed diam urna
          tempor.
        </p>
      </div>
    </div>
  {/if}
</selection>
