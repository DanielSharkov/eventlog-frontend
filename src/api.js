function API(baseURL) {
	console.log('init API', baseURL)
	async function getBegin() {
		try {
			const resp = await fetch(baseURL + '/begin')
			const json = await resp.json()
			return json.offset
		} catch(err) {
			throw new Error('failed to get begin:', err)
		}
	}
	async function getVersion() {
		try {
			const resp = await fetch(baseURL + '/version')
			const json = await resp.json()
			return json.version
		} catch(err) {
			throw new Error('failed to get version:', err)
		}
	}
	async function getLog(offset) {
		if (typeof offset !== 'string') {
			throw new Error(`invalid offset given: ${offset} (${typeof offset})`)
		}
		try {
			const resp = await fetch(baseURL + '/log/' + offset)
			if (resp.status !== 200) {
				const respCode = await resp.text()
				if (respCode == 'ErrOffsetOutOfBound') {
					return null
				}
				throw new Error(
					`failed to get log with status ${resp.status}:`,
					respCode,
				)
			}
			const json = await resp.json()
			return json
		} catch(err) {
			console.log('getLog', offset, err)
		}
	}

	async function postLog() {
		try {
			fetch(baseURL + '')
		} catch(err) {
		}
	}
	async function postLog() {
		try {
			fetch(baseURL + '')
		} catch(err) {
		}
	}

	Object.defineProperties(this, {
		getBegin: { value: getBegin },
		getVersion: { value: getVersion },
		getLog: { value: getLog },
		postLog: { value: postLog },
		postLog: { value: postLog },
	})
	Object.freeze(this)
}

export const api = new API('http://localhost:8080')
