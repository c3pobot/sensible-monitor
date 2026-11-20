import { inherits } from 'util'
import logger from './logger.js'
import log from './logger.js'
import fs from 'fs'

let dataList = { clients: [], ready: false }
const CLIENT_INFO_FILE = process.env.CLIENT_INFO_FILE || '/opt/data/clients.json'

async function readFile(){
  try{
    if(!CLIENT_INFO_FILE) return
    let data = await fs.readFileSync(CLIENT_INFO_FILE)
    if(data) return JSON.parse(data)
  }catch(e){
    log.error(`error reading ${CLIENT_INFO_FILE}`)
  }
}
async function init(){
    try{
        let data = await readFile();
        if(!data || data?.length == 0) return setTimeout(init, 5000);
        log.info(`dataList updated`)
        dataList.clients = data
        dataList.ready = true
    }catch(e){
        log.error(e)
        setTimeout(init, 5000)
    }
}
init();
export { dataList }