const scoreRepository = require('../repository/scoresRepository');

const cpuScore = (cpu) => {
    const res = scoreRepository.cpuScore(cpu);
    return res;
}

const gpuScore = (gpu) => {
    const res = scoreRepository.gpuScore(gpu);
    return res;
}

module.exports = {
    cpuScore,
    gpuScore
}