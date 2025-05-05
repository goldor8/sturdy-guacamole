import jwt from 'jsonwebtoken';
import { UserType } from '../models/userType';
import { buildWebError } from './errorHandling/webError';

interface TokenPayload {
    username: string;
    userType: UserType;
    expiration: number;
}

function generateToken(username: string, userType: UserType): string {
    const payload: TokenPayload = { username, userType, expiration: Date.now() + 24 * 60 * 60 * 1000 }; // Token valid for 24 hour
    const secretKey = process.env.JWT_SECRET_KEY;
    
    return jwt.sign(payload, secretKey as string);
}

function verifyToken(token: string): TokenPayload | null {
    const secretKey = process.env.JWT_SECRET_KEY;
    
    try {
        const decoded = jwt.verify(token, secretKey as string) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

function validateUserToken(token: string): TokenPayload {
    const decoded = verifyToken(token);
    if (!decoded) {
        throw buildWebError(401, 'Invalid token');
    }
    
    if (decoded.expiration < Date.now()) {
        throw buildWebError(401, 'Token expired');
    }

    return decoded;
}

function validateAdminToken(token: string): TokenPayload {
    const decoded = validateUserToken(token);
    if (decoded.userType !== UserType.ADMIN) {
        throw buildWebError(403, 'Not authorized as admin');
    }
    
    return decoded;
}

function getTokenFromRequest(request: any): string {
    return request.headers['authorization']?.split(' ')[1];
}

function validateUserRequest(request: any): TokenPayload {
    const token = getTokenFromRequest(request);
    if (!token) {
        throw buildWebError(401, 'No token provided');
    }
    
    return validateUserToken(token);
}

function validateAdminRequest(request: any): TokenPayload {
    const token = getTokenFromRequest(request);
    if (!token) {
        throw buildWebError(401, 'No token provided');
    }
    
    return validateAdminToken(token);
}

export default {
    generateToken,
    validateUserRequest,
    validateAdminRequest,
    validateUserToken,
    validateAdminToken,
};