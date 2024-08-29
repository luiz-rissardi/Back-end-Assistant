import YTMusic from "ytmusic-api"

const ytmusic = new YTMusic()
await ytmusic.initialize()

ytmusic.searchSongs("journey").then(songs => {
	console.log(songs.slice(0,10))
})