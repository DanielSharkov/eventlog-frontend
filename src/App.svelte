<script>
	import { api } from './api'
	import LogEntry from './LogEntry.svelte'
	import { fade } from 'svelte/transition'

	let loading = false

	let offset = null
	let version = null

	let isActualVersion = false

	let amountToFetch = 10

	let log = []

	function init() {
		loading = true
		return new Promise(async (resolve, reject)=> {
			try {
				const off = await api.getBegin()
				offset = off
				const vers = await api.getVersion()
				version = vers
			} catch(err) {
				reject(err)
			}
			resolve()
		})
	}
	init().then(loadEntries)

	async function loadEntry(off, count) {
		return new Promise(async (resolve, reject)=> {
			if (count === null || count >= amountToFetch) {
				return
			}
			let next = null
			try {
				const entry = await api.getLog(off)
				if (entry === null) {
					isActualVersion = true
					return reject()
				}
				next = entry.next
				offset = next
				log.push(entry)
				log = log
				if (next === version) {
					isActualVersion = true
				}
				if (next !== null) {
					loadEntry(next, count + 1)
				}
				resolve()
			} catch(err) {
				console.error(err)
			}
		})
	}

	async function loadEntries() {
		loading = true
		let lastScroll = document.scrollingElement.scrollTop
		await loadEntry(offset, 0)
		document.scrollingElement.scrollTop = lastScroll
		loading = false
	}
</script>



<style>
	main {
		max-width: 960px;
		margin: auto;
		padding: 1rem 1rem 4rem 1rem;
	}

	h1 {
		font-weight: 100;
	}

	#log {
		display: grid;
		grid-template-columns: 100%;
		grid-gap: 1rem;
	}

	.load-more {
		display: block;
		margin: 1rem auto 0 auto;
		padding: .5rem 2rem;
	}

	#loader {
		z-index: 100;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, .85);
	}

	#loader .spinner {
		animation: rotator 1.4s linear infinite;
	}

	@keyframes rotator {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(270deg); }
	}

	#loader .spinner .path {
		stroke-dasharray: 187;
		stroke-dashoffset: 0;
		transform-origin: center;
		animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
		stroke: #fff;
	}

	@keyframes colors {
		0% { stroke: #4285F4; }
		25% { stroke: #DE3E35; }
		50% { stroke: #F7C223; }
		75% { stroke: #1B9A59; }
		100% { stroke: #4285F4; }
	}

	@keyframes dash {
		0% { stroke-dashoffset: 187; }
		50% {
			stroke-dashoffset: 46.75;
			transform:rotate(135deg);
		}
		100% {
			stroke-dashoffset: 187;
			transform:rotate(450deg);
		}
	}
</style>



<main>
	<h1>Event Log</h1>
	<div id='log'>
		{#each log as {time, payload, offset}}
			<LogEntry {time} {payload} {offset}/>
		{/each}
	</div>
	{#if !isActualVersion}
		<button class='load-more' on:click={ loadEntries }>Load next 10</button>
	{/if}
</main>

{#if loading}
	<div id='loader' transition:fade={{ duration: 500 }}>
		<svg class='spinner' width='65px' height='65px' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'>
			<circle class='path' fill='none' stroke-width='2' stroke-linecap='round' cx='33' cy='33' r='30'></circle>
		</svg>
	</div>
{/if}
