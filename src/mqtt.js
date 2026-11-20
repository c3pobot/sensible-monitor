import mqtt from 'mqtt';
import log from '/app/src/logger.js';

let connectMsg = false, MQTT_STATUS = false, client;
const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_PORT = process.env.MQTT_PORT || '1883';
const MQTT_USER = process.env.MQTT_USER || 'hassio';
const MQTT_PASS = process.env.MQTT_PASS || 'hassio';
const NODE_NAME = process.env.NODE_NAME;

if (MQTT_HOST) {
  const connectUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;
  log.info(`MQTT Connect URL: ${connectUrl}`);

  client = mqtt.connect(connectUrl, {
    clientId: `mqtt_${NODE_NAME}_sensible`,
    clean: true,
    keepalive: 60,
    connectTimeout: 4000,
    username: MQTT_USER,
    password: MQTT_PASS,
    reconnectPeriod: 1000,
  });
  client.on('connect', () => {
    if (!connectMsg) {
      connectMsg = true;
      MQTT_STATUS = true;
      log.info('MQTT Connection successful...');
    }
  });
}
function status(){
  return MQTT_STATUS;
};

function publish(topic, value, retain = false){
  if (!MQTT_STATUS || !topic) return;
  return new Promise((resolve, reject) => {
    client.publish(topic, (value || 0)?.toString(), { qos: 1, retain }, (error) => {
      if (error){
        log.error(error)
        reject();
      } 
      resolve(true);
    });
  });
};
export default { status, publish };