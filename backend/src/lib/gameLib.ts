import {rowQuery, rowsQuery, executeQuery} from './sqlLib'

function getGameById(id: number) {
  return rowQuery<Game>('SELECT * FROM game WHERE id = ?', [id])
}

