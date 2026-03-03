const { getVisitorCount } = require('./utils/dynamodb');

const ALLOWED_ORIGINS = new Set([
    'https://resume.ibukuntaiwo.com',
    'https://ibukuntaiwo.com',
    'https://www.ibukuntaiwo.com'
]);

function getAllowedOrigin(event) {
    const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
    return ALLOWED_ORIGINS.has(origin) ? origin : 'https://resume.ibukuntaiwo.com';
}

exports.handler = async (event) => {
    const allowedOrigin = getAllowedOrigin(event);
    try {
        const count = await getVisitorCount();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ count })
        };
    } catch (error) {
        console.error('Error retrieving visitor count:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: 'Could not retrieve visitor count' })
        };
    }
};