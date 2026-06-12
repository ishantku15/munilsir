const crypto = require('crypto');

const encryptedStr = 'm7hcRsBTJp5eNY5aTdn8qh+TnN4WJc/KrPFgqswDWpuSNXQ5vmDRhyU2qit9f9r71FaH1dT4roMCcAwDyIfT6ITDmZocbbSPGjfiW3NAQXyFa+dwu2CuFd3LF3gDhp1yNmNuBu6m0wFxEHGGk2F+xTvXRxVQffb8RuHXEjcah5jscqkUTq/GRoylTuMFRRFNfr2krBRDWhErpEHFGdJI6PIJGWcGHPav7OD0e3Gf8H2ZRcyjDBQiALhw321no3BFZj6sykYMtvGOOJr/ASpPQeRl4tVsddIS5NL109dzmrBdMHRXUtmoSN4CLDZyliagrlR/kdZS5XbAavJ6pQIjhFykHF+cL72XdDMselzvBH2fQ6SC07Rl4E5cqrzrfyMtnMXciS0Y/tcZl4pT7lX2AjOpwIVoIgqXXH/4hVh6yHMDwJpX/+XQF+XGc3ThT4HLZcd1qonR9EB2fHtzZX2UWIeqB1Zn6p8knoq87ZHIJ83ajdAKxfQuDkwMEGPUVUDz:ZmVkY2JhOTg3NjU0MzIxMA==';
const parts = encryptedStr.split(':');
const cipherText = parts[0];
const keyB64 = parts[1]; // ZmVkY2JhOTg3NjU0MzIxMA==
const ivDoubleB64 = 'Uy9kUS9FLzQ3UFpBcTdUNFptcURXdz09';

// The key is actual ASCII "fedcba9876543210", so we need to decode base64
const keyBuf = Buffer.from(keyB64, 'base64');

// The IV is double base64 encoded
const ivB64 = Buffer.from(ivDoubleB64, 'base64').toString('utf8');
const ivBuf = Buffer.from(ivB64, 'base64');

const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuf, ivBuf);
// AppX uses PKCS7 padding by default in NodeJS
let decrypted = decipher.update(cipherText, 'base64', 'utf8');
decrypted += decipher.final('utf8');

console.log('Decrypted URL:');
console.log(decrypted);
