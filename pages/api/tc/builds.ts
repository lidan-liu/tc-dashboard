import type { NextApiRequest, NextApiResponse } from 'next';
import { parse, stringify } from 'querystring';

type ResponseData = {
  message: string;
};

const BASE_URL = 'https://tango.tools.trainline.com';

// const url = `${BASE_URL}/app/rest/builds?locator=count:1000,buildType:DesktopWeb_Tests_UiAcceptanceTestsMocked,branch:master`
// const url = `${BASE_URL}/app/rest/builds?locator=count:1000,buildType:DesktopWeb_Tests_UiAcceptanceTestsMocked,branch:default:any`

const token = 'eyJ0eXAiOiAiVENWMiJ9.NGE5TUJfbVladmRNd2luWS12Rl90WGNBT0t3.ZWEwMWQ0NDQtNzlkZC00ZjczLWFlZjQtNjkyYzUyZjViYjFi'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const {
        query: {
            branch,
            start,
            end,
            build = 'DesktopWeb_Tests_UiAcceptanceTestsMocked'
        },
      } = req;

    // console.log('branch', branch)
    const branchQueryString = branch === 'master' ? 'branch:master' : 'branch:default:any'

    const startString = typeof start === 'string' ? start.replace('+', '%2b') : ''
    const endString = typeof end === 'string' ? end.replace('+', '%2b') : ''
    
    const url = `${BASE_URL}/app/rest/builds?locator=count:1000,buildType:${build},${branchQueryString},sinceDate:${startString},startDate:(date:${endString},condition:before)`
    
    // /app/rest/builds?locator=count:1000,buildType:DesktopWeb_Tests_UiAcceptanceTestsMocked,branch:master,sinceDate:20231022T000000+0100,startDate:(date:20231023T000000+0100,condition:before)
    // /app/rest/builds?locator=count:1000,buildType:DesktopWeb_Tests_UiAcceptanceTestsMocked,branch:master,sinceDate:20231016T000000%2b0100,startDate:(date:20231018T000000%2b0100,condition:before)`
    // /app/rest/builds?locator=count:1000,buildType:DesktopWeb_Tests_UiAcceptanceTestsMocked,branch:master,sinceDate:20231022T000000%2b0100},startDate:(date:20231022T000000%2b0100,condition:before)
    // const url = `${BASE_URL}/app/rest/builds?locator=count:1000,buildType:DesktopWeb_Tests_UiAcceptanceTestsMocked,${branchQueryString}`
    console.log(url)
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
            message: 'error'
        });
    }
  
}
