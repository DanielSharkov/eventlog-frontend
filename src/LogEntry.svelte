<script>
	import { onMount } from 'svelte'

	export let time;
	export let payload;
	export let offset;

	let expandPayload = false

	let payloadEl = null
	let largeContent = false

	onMount(()=> {
		largeContent = payloadEl.offsetHeight > 200
	})
</script>



<style>
	.entry {
		padding: 1rem;
		box-sizing: border-box;
		border-radius: 3px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, .5);
		background-color: #fff;
	}

	.offset .value {
		padding: .25rem .5rem;
		background-color: rgba(0, 0, 0, .05);
		border-radius: 3px;
		font-size: .85rem;
		font-family: 'Cascadia Code', 'Fire Code', 'Monaco', monospace;
	}

	.payload-container {
		position: relative;
		background-color: rgba(0, 0, 0, .025);
	}

	.payload-container .toggle {
		z-index: 1;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		padding: .5rem 1rem;
		color: #06f;
	}

	.payload-container.expanded .payload {
		padding-bottom: 3rem;
	}
	.payload-container.expanded .toggle {
		bottom: 1rem;
		padding: 1rem;
	}
	.payload-container.large-content:not(.expanded):after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 6rem;
		pointer-events: none;
		background: -moz-linear-gradient(0deg, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%);
		background: -webkit-linear-gradient(0deg, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%);
		background: linear-gradient(0deg, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%);
	}
	
	.payload-container .payload {
		margin: 0;
		padding: .5rem;
		overflow: auto;
	}
	.payload-container.large-content:not(.expanded) .payload {
		max-height: 200px;
		overflow: hidden;
	}
</style>



<div class='entry'>
	<div class='offset'>
		Offset <span class='value'>{offset}</span>
	</div>
	<p class='time'>{time}</p>
	<div
	class='payload-container'
	class:expanded={ expandPayload }
	class:large-content={ largeContent }>
		<pre class='payload' bind:this={ payloadEl }>{ JSON.stringify(payload, null, 4) }</pre>
		{#if largeContent}
			<button class='toggle link' on:click={ ()=> expandPayload = !expandPayload }>
				{#if expandPayload}
					Hide content
				{:else}
					Show all content
				{/if}
			</button>
		{/if}
	</div>
</div>
