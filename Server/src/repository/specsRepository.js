const {search} = require("fast-fuzzy");
const cpuScores = require('../data/cpu_scores');
const gpuScores = require("../data/gpu_scores");

const searchCpu = (cpuName) => {
    const cpuArray = search(cpuName,cpuScores.map((cpu) => cpu.cpuName));
    return cpuArray.filter((_,i) => i<=5);
}

const searchGpu = (gpuName) => {
    const gpuArray = search(gpuName,gpuScores.map((gpu) => gpu.gpuName));
    return gpuArray.filter((_,i) => i<=5);
}

module.exports = {
    searchCpu,
    searchGpu
}