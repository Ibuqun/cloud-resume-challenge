const { getVisitorCount, updateVisitorCount } = require('../utils/dynamodb');

exports.handler = async (event) => {
    try {
        // Get current count and increment by 1
        const currentCount = await getVisitorCount();
        const newCount = currentCount + 1;
        
        // Update the count
        await updateVisitorCount(newCount);
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
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
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};