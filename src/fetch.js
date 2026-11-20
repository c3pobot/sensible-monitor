import log from './logger.js'

async function parseResponse(r){
  let contentType = r?.headers.get("content-type")
  if(contentType && contentType?.indexOf("application/json") !== -1) return await r?.json()
}

async function requestWithRetry(url, opts, count = 0){
  try{
    opts.signal = AbortSignal.timeout(10000)
    let r = await fetch(url, opts)
    count++
    let res = await parseResponse(r)
    if(!r.ok && count < retryCount) return await requestWithRetry(url, opts, count)
    return res
  }catch(e){
    log.error(e)
  }
}

async function get(uri, headers){
    try{
        let opts = { compress: true, method: 'GET' }
        if(headers) opts.headers = headers
        return await requestWithRetry(uri, opts, 0)
    }catch(e){
        log.error(e)
    }
}
async function post(uri, body, headers){
  try{
    let opts = { compress: true, method: 'POST' }
    if(headers) opts.headers = headers
    if(body) opts.body = body
    return await requestWithRetry(uri, opts, 0)
  }catch(e){
    log.error(uri)
    log.error(e)
  }
}
export default { get, post }