import { Game } from '../models/game'
import {rowQuery, rowsQuery, executeQuery} from './sqlLib'

async function getGameById(id: number): Promise<Game | null> {
  return await rowQuery<Game>('SELECT * FROM game WHERE id_game = ?', [id])
}

async function getRandomGame(): Promise<Game | null> {
  return await rowQuery<Game>('SELECT * FROM game ORDER BY RAND() LIMIT 1', [])
}
async function getDuelGamesByCategory(category: string): Promise<Game[]> {
    return await rowsQuery<Game>( 'CALL get_duel_games_by_category(?)', [category])
}
async function getDuelGamesByCategories(
    category: string | null,
    minPlayers: number | null,
    maxPlayers: number | null,
    yearFirst: number | null,
    yearLast: number | null,
    playTimeMin: number | null,
    playTimeMax: number | null
    ): Promise<Game[]> {
    // IN p_categories      VARCHAR(255),  -- liste CSV ou NULL
    //     IN p_minPlayers      INT,           -- minPlayers ou NULL
    //     IN p_maxPlayers      INT,           -- maxPlayers ou NULL
    //     IN p_yearFirst       INT,           -- premier yearPublished ou NULL
    //     IN p_yearLast        INT,           -- dernier yearPublished ou NULL
    //     IN p_playTimeMin     INT,           -- min playing_time ou NULL
    //     IN p_playTimeMax     INT            -- max playing_time ou NULL




    return await rowsQuery<Game>('CALL get_duel_games_by_categories(?, ?, ?, ?, ?, ?, ?)', [category, minPlayers, maxPlayers, yearFirst, yearLast, playTimeMin, playTimeMax])
}
export default {
    getGameById,
    getRandomGame,
    getDuelGamesByCategory,
    getDuelGamesByCategories,

}
