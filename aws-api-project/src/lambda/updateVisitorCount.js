const { updateVisitorCount } = require('./utils/dynamodb');

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
        const newCount = await updateVisitorCount();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
            },
            body: JSON.stringify({ count: newCount })
        };
    } catch (error) {
        console.error('Error updating visitor count:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};