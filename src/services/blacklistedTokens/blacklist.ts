import client from '../../models/connect/redis';

/**
 * add a token to the blacklist
 * @param token token to be blacklisted
 */
export const blacklistToken = async (token: string) => {
    await client.setEx('blacklisted', 3600 * 24, token);
};

/**
 * check if a token is blacklisted
 * @param token token to be checked
 * @returns boolean
 */
export const isTokenBlacklisted = async (token: string) => {
    const result = await client.get('blacklisted');
    return result === token;
};