// TODO: implement throttling
// TODO: move to env var
// const MAX_REQ_PER_SEC = 1
// TODO: move to env var
const BASE_API_URL = "https://musicbrainz.org/ws/2"
// TODO: move to env var
const USER_AGENT_STRING = "@sutor/pscan"

/**
 * TODO:IMPORTANT: placeholder, need to actually parse the response
 */
export function parseMusicBrainzRelease(obj: any) {
  const res = {
    artists: "unknown",
    year: "unknown",
    title: "unknown",
    type: "unknown"
  }

  if (Array.isArray(obj?.releases) && obj.releases.length > 0) {
    const release = obj.releases[0]
    if (release?.date) {
      res.year = release.date
    }
    if ("release-group" in release) {
      res.title = release["release-group"].title
      res.type = release["release-group"]["primary-type"]
    }
    if (Array.isArray(release["artist-credit"]) && release["artist-credit"]?.length > 0) {
      res.artists = release["artist-credit"].map((credit) => credit.artist.name!).join(", ")
    }
  }

  return res;
}

export async function queryEan13(code: string) {
  const searchUrl = new URL(`${BASE_API_URL}/release/?`)
  searchUrl.searchParams.append("query", `barcode:${code}`)
  searchUrl.searchParams.append("fmt", "json")

  const headers = new Headers({ "User-Agent": encodeURIComponent(USER_AGENT_STRING) })

  const req = await fetch(searchUrl, { headers })
  if (req.ok) {
    return req.json()
  } else {
    throw new Error(JSON.stringify(req))
  }
}
