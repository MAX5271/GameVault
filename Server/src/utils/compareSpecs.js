const { search } = require('fast-fuzzy');
const cpuScore = require('../data/cpu_scores');
const gpuScore = require('../data/gpu_scores');

const VRAM_SCORES = {
    128: 100, 256: 250, 512: 600,
    1024: 1800, 2048: 3500, 3072: 5500,
    4096: 8000, 6144: 10000, 8192: 14000
};

const extractVramNumber = (text) => {
    if (!text) return null;
    const match = text.match(/(\d+)\s*(mb|gb)/i);
    if (!match) return null;

    let number = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'gb') number = number * 1024;

    return number;
};

const estimateCpuScore = (cpuString) => {
    const text = cpuString.toLowerCase();
    let score = 0;

    if (text.includes('i9')) score = 18000;
    else if (text.includes('i7')) score = 11000;
    else if (text.includes('i5')) score = 7000;
    else if (text.includes('i3')) score = 4500;
    else if (text.includes('pentium')) score = 2500;
    else if (text.includes('celeron') || text.includes('atom')) score = 1200;
    else if (text.includes('core 2 quad')) score = 3000;
    else if (text.includes('core 2 duo')) score = 1500;

    const genMatch = text.match(/-?(\d{4,5})/);
    if (genMatch) {
        const modelNumber = parseInt(genMatch[1]);
        if (modelNumber > 10000) score += 8000;
        else if (modelNumber > 8000) score += 5000;
        else if (modelNumber > 6000) score += 3000;
        else if (modelNumber > 4000) score += 1000;
    }

    if (text.includes('ryzen 9')) score = 22000;
    else if (text.includes('ryzen 7')) score = 16000;
    else if (text.includes('ryzen 5')) score = 12000;
    else if (text.includes('ryzen 3')) score = 7000;
    else if (text.includes('fx-8')) score = 5000;
    else if (text.includes('fx-6')) score = 4000;
    else if (text.includes('fx-4')) score = 2800;
    else if (text.includes('phenom ii x6')) score = 3500;
    else if (text.includes('phenom ii x4')) score = 2800;

    if (score === 0) {
        if (text.includes('quad')) score = 2500;
        else if (text.includes('dual')) score = 1200;
        else if (text.includes('ghz')) score = 1000;
    }
    return score;
};

const getCpuScore = (cpuName) => {
    if (!cpuName) return 0;
    const cleanName = cpuName.replace(/\(r\)/gi, '').replace(/\(tm\)/gi, '').replace(/[®™]/g, '').trim();
    
    const cpuNameArray = search(cleanName, cpuScore.map((cpu) => cpu.cpuName));
    const matchedCpu = cpuScore.find((cpu) => cpuNameArray[0] === cpu.cpuName);

    if (matchedCpu) return matchedCpu.g3dMark;

    return estimateCpuScore(cleanName);
};

const getGpuScore = (gpuName) => {
    if (!gpuName) return 0;
    const cleanName = gpuName.replace(/\(r\)/gi, '').replace(/\(tm\)/gi, '').replace(/[®™]/g, '').trim();

    const gpuNameArray = search(cleanName, gpuScore.map((gpu) => gpu.gpuName));
    const matchedGpu = gpuScore.find((gpu) => gpuNameArray[0] === gpu.gpuName);

    if (matchedGpu) return matchedGpu.g3dMark;

    const vramAmount = extractVramNumber(cleanName);
    if (vramAmount) {
        for (const [key, score] of Object.entries(VRAM_SCORES)) {
            if (vramAmount <= parseInt(key)) return score;
        }
    }
    return 0;
};

const compareRam = (ram, comparedRam) => {
    if (typeof comparedRam === 'number') return ram >= comparedRam;
    
    const comparedRamNum = comparedRam.toString().trim().match(/(\d+)/); 
    if(comparedRamNum) {
        return ram >= parseInt(comparedRamNum[0]);
    }
    return false;
};

const parseRequirements = (text) => {
  if (!text) return { cpu: [], gpu: [], ram: 0 };

  const specs = { cpu: [], gpu: [], ram: 0 };

  const ramMatch = text.match(/(?:Memory|RAM|Оперативна)[^\d]*(\d+)\s*GB/i);
  if (ramMatch) specs.ram = parseInt(ramMatch[1]);

  const cpuMatch = text.match(
    /(?:Processor|Процесор)\s*:\s*([\s\S]*?)(?=(?:Memory|RAM|Graphics|Video Card|Storage|Sound Card|Additional Notes|Оперативна|Відеокарта|DirectX|Місце|Додаткові|Network|Мережа)\s*:|$)/i
  );
  if (cpuMatch && cpuMatch[1]) {
    specs.cpu = cpuMatch[1]
      .split(/\s*[\/]\s*|\s+or\s+/i)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  const gpuMatch = text.match(
    /(?:Graphics|Video Card|Відеокарта)(?:\s*:|\s+must\s+be)\s*([\s\S]*?)(?=(?:Storage|Sound Card|Additional Notes|DirectX|Місце|Додаткові|Network|Мережа)\s*:|$)/i
  );
  if (gpuMatch && gpuMatch[1]) {
    specs.gpu = gpuMatch[1]
      .split(/\s*[\/]\s*|\s+or\s+/i)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  return specs;
};

module.exports = {
    getCpuScore,
    getGpuScore,
    compareRam,
    parseRequirements
};