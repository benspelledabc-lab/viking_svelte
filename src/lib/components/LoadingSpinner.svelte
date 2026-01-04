<!-- <script>
  export let size = 24;
  export let color = "#ff3e00";
</script>

<div
  class="spinner"
  style="
		width: {size}px;
		height: {size}px;
		border-top-color: {color};
	"
></div>

<style>
  .spinner {
    border: 3px solid #e0e0e0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style> -->

<script>
  export let size = 32;
  export let thickness = 6;
  export let color = "#ff3e00";
</script>

<div
  class="spinner"
  style="
		width: {size}px;
		height: {size}px;
		border-width: {thickness}px;
		border-top-color: {color};
	"
></div>

<style>
  .spinner {
    border-style: solid;
    border-color: #e0e0e0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    box-sizing: border-box;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
