/**
 * Fetches elevation in feet for a given lat/lon from the USGS Elevation Point Query Service.
 * @param { number } lat - Latitude of the location.
 * @param { number } lon - Longitude of the location.
 * @returns { Promise<number> } Elevation in feet.
 */
export async function fetchElevation(lat: number, lon: number): Promise<number> {

  const url = `https://epqs.nationalmap.gov/v1/json?x=${ lon }&y=${ lat }&units=Feet&wkid=4326`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Elevation API request failed with status ${ response.status }`)
  }

  const data = await response.json() as { value: number }

  return data.value
}