export default [
    { name: 'CPU Load', topic: 'cpu_load', config: { icon: 'mdi:cpu-64-bit', unit_of_measurement: '%' } },
    { name: 'Hostname', topic: 'host_name', config: { icon: 'mdi:network' } },
    { name: 'Boot Time', topic: 'boot_time', config: { icon: 'mdi:clock' } },
    { name: 'Mem Total', topic: 'mem_total', config: { icon: 'mdi:memory', unit_of_measurement: 'GB' } },
    { name: 'Mem Free', topic: 'mem_free', config: { icon: 'mdi:memory', unit_of_measurement: 'GB' } },
    { name: 'Mem Used', topic: 'mem_used', config: { icon: 'mdi:memory', unit_of_measurement: 'GB' } },
    { name: 'Mem Load', topic: 'mem_load', config: { icon: 'mdi:memory', unit_of_measurement: '%' } },
    { name: 'Docker Used', topic: 'docker_mem', config: { icon: 'mdi:memory', unit_of_measurement: 'GB' } },
    { name: 'Docker Load', topic: 'docker_cpu', config: { icon: 'mdi:cpu-64-bit', unit_of_measurement: '%' } },
    { name: 'Connected', topic: 'connected', type: 'binary_sensor', config: { entity_category: 'diagnostic', device_class : 'connectivity', expire_after: 60 } },
]
