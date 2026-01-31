const compareSpecs = require('../utils/compareSpecs');

const compareCpu = (cpuName, comparedCpu) => {
    if (!comparedCpu || comparedCpu.length === 0) return true;
    
    const cpuArray = Array.isArray(comparedCpu) 
        ? comparedCpu 
        : comparedCpu.split(/\s*[\/]\s*|\s+or\s+/i);

    const scoreArray = cpuArray.map((cpu) => {
        const cleanName = cpu.trim().split('(')[0]; 
        return compareSpecs.getCpuScore(cleanName);
    });

    const userScore = compareSpecs.getCpuScore(cpuName);
    
    const validScores = scoreArray.filter(s => s > 0);
    if (validScores.length === 0) return true; 
    
    return userScore >= Math.min(...validScores);
};

const compareGpu = (gpuName, comparedGpu) => {
    if (!comparedGpu || comparedGpu.length === 0) return true;

    const gpuArray = Array.isArray(comparedGpu) 
        ? comparedGpu 
        : comparedGpu.split(/\s*[\/]\s*|\s+or\s+/i);

    const scoreArray = gpuArray.map((gpu) => {
        const cleanName = gpu.trim().split('(')[0];
        return compareSpecs.getGpuScore(cleanName);
    });

    const userScore = compareSpecs.getGpuScore(gpuName);
    
    const validScores = scoreArray.filter(s => s > 0);
    if (validScores.length === 0) return true; 

    return userScore >= Math.min(...validScores);
};

module.exports = {
    compareCpu,
    compareGpu
};