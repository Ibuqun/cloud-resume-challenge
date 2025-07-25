const { getVisitorCount } = require('./utils/dynamodb');

exports.handler = async (event) => {
    try {
        const count = await getVisitorCount();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
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
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: 'Could not retrieve visitor count' })
        };
    }
};