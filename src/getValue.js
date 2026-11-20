function bytesToGB(bytes){
    let value = +((bytes || 0) / 1024 ** 3)
    if(value < 1) return value?.toFixed(3)
    return value?.toFixed(1)
}
function cpu_load(data = {}){
    let value = data?.quicklook?.cpu
    if(value >= 0) return value?.toString()
}
function boot_time(data = {}){
    return data?.uptime
}
function mem_total(data = {}){
    return bytesToGB(data?.mem?.total);
}
function mem_free(data = {}){
    return bytesToGB(data?.mem?.free);
}
function mem_used(data = {}){
    return bytesToGB(data?.mem?.used);
}
function mem_load(data = {}){
    return data?.mem?.percent
}
function docker_mem(data = {}){
    let value = 0
    for(let i of data.containers) value += parseInt(i.memory_usage || 0)
    return bytesToGB(value);
}
function docker_cpu(data = {}){
    let value = 0
    for(let i of data.containers) value += (i.cpu_percent || 0)
    return value?.toFixed(2)
}

export default { cpu_load, boot_time, mem_total, mem_free, mem_used, mem_load, docker_mem, docker_cpu }