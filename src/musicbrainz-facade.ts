// TODO: implement throttling
// TODO: move to env var
// const MAX_REQ_PER_SEC = 1
// TODO: move to env var
const BASE_API_URL = "https://musicbrainz.org/ws/2"
// TODO: move to env var
const USER_AGENT_STRING = "@sutor/pscan"


export async function queryEan13(code: string) {
  const searchUrl = new URL(`${BASE_API_URL}/release/?`)
  searchUrl.searchParams.append("query", `barcode:${code}`)
  searchUrl.searchParams.append("fmt", "json")

  const headers = new Headers({ "User-Agent": encodeURIComponent(USER_AGENT_STRING) })

  const req = await fetch(searchUrl, { headers })
  if (req.ok) {
    const res = req.json()
    return res
  } else {
    throw new Error(JSON.stringify(req))
  }
}
