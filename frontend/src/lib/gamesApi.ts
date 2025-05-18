import { get } from "./apiBridge"

async function getGameThumbnailById(id: number): Promise<string | null> {
    let res = await get('/games/thumbnail/' + id, {})
    console.log(res.thumbnail);
    
    return res.thumbnail
}

export {
    getGameThumbnailById,
}