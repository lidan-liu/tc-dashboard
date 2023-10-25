import type { NextApiRequest, NextApiResponse } from 'next';


type ResponseData = {
  message: string;
};

const BASE_URL = 'https://tango.tools.trainline.com';


const token = 'eyJ0eXAiOiAiVENWMiJ9.NGE5TUJfbVladmRNd2luWS12Rl90WGNBT0t3.ZWEwMWQ0NDQtNzlkZC00ZjczLWFlZjQtNjkyYzUyZjViYjFi'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const url = `${BASE_URL}/app/rest/server/metrics`
    
    try {
        const response = await fetch(url, {
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        const json = await response.json();
        return res.status(200).json(json);
    } catch (e) {
        return res.status(500).json({
            message: 'error',
        });
    }
  
}
