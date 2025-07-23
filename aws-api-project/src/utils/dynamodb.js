const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

const getVisitorCount = async () => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: 'visitorCount'
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item ? result.Item.count : 0;
    } catch (error) {
        console.error('Error getting visitor count:', error);
        throw new Error('Could not retrieve visitor count');
    }
};

const updateVisitorCount = async (newCount) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: 'visitorCount'
        },
        UpdateExpression: 'SET #count = :count',
        ExpressionAttributeNames: {
            '#count': 'count'
        },
        ExpressionAttributeValues: {
            ':count': newCount
        }
    };

    try {
        await dynamoDB.update(params).promise();
        return newCount;
    } catch (error) {
        console.error('Error updating visitor count:', error);
        throw new Error('Could not update visitor count');
    }
};

module.exports = {
    getVisitorCount,
    updateVisitorCount
};