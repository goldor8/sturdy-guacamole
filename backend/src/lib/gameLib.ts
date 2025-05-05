import { Game } from '../models/game'
import {rowQuery, rowsQuery, executeQuery} from './sqlLib'

async function getGameById(id: number): Promise<Game | null> {
  return await rowQuery<Game>('SELECT * FROM game WHERE id_game = ?', [id])
}

async function getRandomGame(): Promise<Game | null> {
  return await rowQuery<Game>('SELECT * FROM game ORDER BY RAND() LIMIT 1', [])
}


export default {
    getGameById,
    getRandomGame,
}