import mysql, { RowDataPacket, PoolConnection, QueryResult, ResultSetHeader } from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

export async function rowQuery<Data>(sql: string, values: any): Promise<Data | null> {
  let result = await query<RowDataPacket[]>(sql, values)
  if (result.length === 0) {
    return null
  }
  return result[0] as Data
}

export async function rowsQuery<Data>(sql: string, values: any): Promise<Data[]> {
    let result = await query<RowDataPacket[]>(sql, values)
    return result as Data[]
}

export async function executeQuery(sql: string, values: any): Promise<ResultSetHeader> {
    let result = await query<ResultSetHeader>(sql, values)
    return result
}

export async function query<Result extends QueryResult>(sql: string, values: any): Promise<Result> {
  return new Promise((resolve, reject) => {
    pool.query<Result>(sql, values, (err, results) => {
      if (err) {
        console.error('SQL Error:', err)
        return reject(err)
      }
      resolve(results)
    })
  })
}


export function getConnection(): Promise<PoolConnection> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Connection Error:', err)
        return reject(err)
      }
      resolve(connection)
    })
  })
}