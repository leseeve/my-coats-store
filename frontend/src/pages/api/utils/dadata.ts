import { NextApiRequest, NextApiResponse } from 'next';

export default async function dadataHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const response = await fetch(
            'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Token ${process.env.DADATA_API_KEY}`,
                },
                body: JSON.stringify({
                    query,
                    count: 10,
                }),
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: 'DaData error' });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

