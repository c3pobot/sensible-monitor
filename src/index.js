import log from './logger.js'
import mqttDevice from './mqtt_device.js'
import { dataList } from './data_list.js'

function init(){
    try{
        if(!dataList.ready) return setTimeout(init, 5000)
        return mqttDevice.start()
    }catch(e){
        log.error(e)
        setTimeout(init, 5000)
    }
}
init();