const cpu_scores = require('../data/cpu_scores');
const gpu_scores = require('../data/gpu_scores');

const cpuScore = (cpu) => {
    const score = cpu_scores.filter((cpuname)=>{
        if(cpuname["cpuName"]===cpu) return cpuname["g3dMark"];
    })
    if(score) return score;
    throw new Error("CPU not found");
}

const gpuScore = (gpu) => {
    const score = gpu_scores.filter((gpuname)=>{
        if(gpuname["gpuName"]===gpu) return gpuname["g3dMark"];
    })
    if(score) return score;
    throw new Error("CPU not found");
}

module.exports = {
    cpuScore,
    gpuScore
}