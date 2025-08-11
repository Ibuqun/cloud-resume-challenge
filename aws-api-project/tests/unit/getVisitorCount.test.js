const { handler } = require('../../src/lambda/getVisitorCount');
const dynamodb = require('../../src/lambda/utils/dynamodb');

jest.mock('../../src/lambda/utils/dynamodb');

describe('getVisitorCount', () => {
    it('should return the visitor count successfully', async () => {
        const mockCount = 100;
        dynamodb.getVisitorCount.mockResolvedValueOnce(mockCount);

        const event = {};
        const context = {};

        const response = await handler(event, context);

        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({ count: mockCount }),
        });
    });

    it('should return an error if the count retrieval fails', async () => {
        dynamodb.getVisitorCount.mockRejectedValueOnce(new Error('Database error'));

        const event = {};
        const context = {};

        const response = await handler(event, context);

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve visitor count' }),
        });
    });
});