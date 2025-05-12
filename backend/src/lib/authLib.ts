import bcrypt from 'bcrypt';
import {rowQuery, rowsQuery, executeQuery} from './sqlLib'
import {UserType} from '../models/userType'
import { User } from '../models/user';
import { buildWebError } from './errorHandling/webError';
import JWTSecurity from './JWTSecurity';

async function registerUser(username: string, password: string): Promise<string> {
    let userByUsername = await getUserByUsername(username);
    if(userByUsername !== null) {
        throw buildWebError(401, 'Username already exists');
    }

    let hashedPassword = await hashPassword(password);
    await insertUser(username, hashedPassword);

    let user = await getUserByUsername(username);

    return JWTSecurity.generateToken(user.username, user.user_type as UserType);
}

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 14;
    return await bcrypt.hash(password, saltRounds);
}

async function insertUser(username: string, hashedPassword: string): Promise<void> {
    await executeQuery('INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)', [username, "", hashedPassword, UserType.PLAYER]);
}

async function getUserByUsername(username: string): Promise<User | null> {
    return await rowQuery<User>('SELECT * FROM users WHERE username = ?', [username]);
}

async function getUserById(id: number): Promise<User | null> {
    return await rowQuery<User>('SELECT * FROM users WHERE id_user = ?', [id]);
}

async function loginUser(username: string, password: string): Promise<string> {
    const user = await getUserByUsername(username);
    if (!user) {
        throw buildWebError(401, 'User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw buildWebError(403, 'Invalid password');
    }

    return JWTSecurity.generateToken(user.username, user.user_type as UserType);
}

export default {
    registerUser,
    getUserByUsername,
    getUserById,
    loginUser
}