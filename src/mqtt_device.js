import log from './logger.js'
import mqtt from './mqtt.js'
import sensorConfigs from './sensor_config.js'
import { dataList } from './data_list.js'

import fetch from './fetch.js'
import getValue from './getValue.js'

const CLUSTER_NAME = process.env.CLUSTER_NAME || 'c3po'
const CLUSTER_TOPIC_PREFIX = `${(process.env.CLUSTER_NAME || 'c3po')?.toLowerCase()}_cluster`

async function getHostInfo(client){
    try{
        if(!client?.ip) return
        return await fetch.get(`http://${client.ip}:61208/api/4/all`)
    }catch(e){
        log.error(e)
    }
}
async function addSensor(sensor = {}, client = {}){
    if(!sensor.topic || !sensor.name) return
    let HOST_NAME = `${client.name?.replace(/ /g, '')?.toLowerCase()}_host`

    let sensor_config = {
        name: sensor.name,
        state_topic: `glances/${CLUSTER_TOPIC_PREFIX}/${client.name}/${sensor.topic}/state`,
        unique_id: `${HOST_NAME}_${sensor.topic}`,
        device: { name: `${client.name}`, identifiers: [ client.name ], via_device: `${CLUSTER_TOPIC_PREFIX}_main`, configuration_url: `http://${client.ip}:61208` }
    }
    
    if(sensor.config) sensor_config = { ...sensor_config, ...sensor.config }
    return await mqtt.publish(`homeassistant/${sensor.type || 'sensor'}/${CLUSTER_TOPIC_PREFIX}/${client.name}_${sensor.topic}/config`, JSON.stringify(sensor_config), true)
}
async function addClientDevice(client = {}){
    if(!client?.ip) return
    for(let i of sensorConfigs) await addSensor(i, client)
    return true
}
async function createMainDevice(){
    let sensor_config = {
        name: `Name`,
        state_topic: `glances/${CLUSTER_TOPIC_PREFIX}/main/name/state`,
        unique_id: `${CLUSTER_TOPIC_PREFIX}_name`,
        device: { name: `${CLUSTER_NAME} Cluster`, identifiers: [ `${CLUSTER_TOPIC_PREFIX}_main` ] }
    }
    await mqtt.publish(`homeassistant/sensor/${CLUSTER_TOPIC_PREFIX}/main_cluster_name/config`, JSON.stringify(sensor_config), true)
    return true
}
async function init(){
    try{
        if(!mqtt.status()) return setTimeout(init, 5000)
        if(!sensorConfigs || sensorConfigs?.length == 0) return
        if(!dataList?.clients || dataList?.clients?.length == 0) return setTimeout(init, 5000)
        let status = await createMainDevice()
        if(!status) return setTimeout(init, 5000)
        for(let i of dataList?.clients){
            status = await addClientDevice(i)
            if(!status) return setTimeout(init, 5000)
        }
        sync()
    }catch(e){
        log.error(e)
        setTimeout(init, 5000)
    }
}
async function updateClient(client = {}){
    let data = await getHostInfo(client)
    if(!data?.mem) return
    data = { ...data, ...client }
    for(let i of sensorConfigs){
        if(!getValue[i.topic]) continue
        let value = getValue[i.topic](data)
        await mqtt.publish(`glances/${CLUSTER_TOPIC_PREFIX}/${client.name}/${i.topic}/state`, value)
    }
    await mqtt.publish(`glances/${CLUSTER_TOPIC_PREFIX}/${client.name}/connected/state`, 'ON')
    await mqtt.publish(`glances/${CLUSTER_TOPIC_PREFIX}/${client.name}/host_name/state`, client.name)
    await mqtt.publish(`glances/${CLUSTER_TOPIC_PREFIX}/${client.name}/host_ip/state`, client.ip)
}
async function sync(){
    try{
        for(let i of dataList.clients) await updateClient(i)
        setTimeout(sync, 10000)
    }catch(e){
        log.error(e)
        setTimeout(sync, 5000)
    }
}
function start(){
    try{
        init()
    }catch(e){
        log.error(e)
    }
}
export default { start }
