const crypto = require('crypto');

// 加密配置
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

/**
 * 从主密码派生加密密钥
 * @param {string} password - 用户主密码
 * @param {Buffer} salt - 盐值（可选，不传则生成新盐）
 * @returns {Object} { key: Buffer, salt: Buffer }
 */
function deriveKey(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(SALT_LENGTH);
  }
  
  const key = crypto.pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    'sha512'
  );
  
  return { key, salt };
}

/**
 * 加密数据
 * @param {Object} data - 要加密的数据对象
 * @param {string} password - 主密码
 * @returns {string} 加密后的 Base64 字符串
 */
function encrypt(data, password) {
  try {
    const jsonData = JSON.stringify(data);
    const { key, salt } = deriveKey(password);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(jsonData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // 组合: salt + iv + tag + encrypted
    const result = Buffer.concat([
      salt,
      iv,
      tag,
      Buffer.from(encrypted, 'hex')
    ]).toString('base64');
    
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('加密失败');
  }
}

/**
 * 解密数据
 * @param {string} encryptedData - 加密的 Base64 字符串
 * @param {string} password - 主密码
 * @returns {Object} 解密后的数据对象
 */
function decrypt(encryptedData, password) {
  try {
    const data = Buffer.from(encryptedData, 'base64');
    
    // 提取各部分
    const salt = data.slice(0, SALT_LENGTH);
    const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = data.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = data.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    const { key } = deriveKey(password, salt);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return JSON.parse(decrypted.toString('utf8'));
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('解密失败，请检查主密码是否正确');
  }
}

/**
 * 生成密码哈希（用于验证主密码）
 * @param {string} password - 主密码
 * @returns {string} 密码哈希
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * 验证密码
 * @param {string} password - 待验证的密码
 * @param {string} hashedPassword - 存储的哈希值
 * @returns {boolean} 是否匹配
 */
function verifyPassword(password, hashedPassword) {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

module.exports = {
  encrypt,
  decrypt,
  deriveKey,
  hashPassword,
  verifyPassword,
};
