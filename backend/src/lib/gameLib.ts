import { Game } from '../models/game'
import {rowQuery, rowsQuery, executeQuery} from './sqlLib'

async function getGameById(id: number): Promise<Game | null> {
  return await rowQuery<Game>('SELECT * FROM game WHERE id_game = ?', [id])
}

async function getRandomGame(): Promise<Game | null> {
  return await rowQuery<Game>('SELECT * FROM game ORDER BY RAND() LIMIT 1', [])
}

async function getThumbnailById(id: number): Promise<string | null> {
    return await rowQuery<string>('SELECT thumbnail FROM rating WHERE id_game = ?', [id])
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
    return await rowsQuery<Game>('CALL get_duel_games_by_categories(?, ?, ?, ?, ?, ?, ?)', [category, minPlayers, maxPlayers, yearFirst, yearLast, playTimeMin, playTimeMax])
}
async function getGameByCategories(
    category: string | null,
    minPlayers: number | null,
    maxPlayers: number | null,
    yearFirst: number | null,
    yearLast: number | null,
    playTimeMin: number | null,
    playTimeMax: number | null,
    removeId: number[] | null,
): Promise<Game[]> {
    return await rowsQuery<Game>(

        'CALL get_games_by_categories(?, ?, ?, ?, ?, ?, ?, ?)',
        [category, minPlayers, maxPlayers, yearFirst, yearLast, playTimeMin, playTimeMax, removeId]
    );
}


async function getAllCategories(): Promise<string[]> {

    const result = await rowQuery<{ toutes: string }>(
     'SELECT get_all_categories() AS toutes',
     []
    );
    return result ? result.toutes.split(', ').map(s => s.trim()) : [];
}
export default {
    getGameById,
    getThumbnailById,
    getRandomGame,
    getDuelGamesByCategory,
    getDuelGamesByCategories,
    getGameByCategories,
    getAllCategories

}
