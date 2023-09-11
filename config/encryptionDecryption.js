import crypto from 'crypto';

const encrypt = (text) => {
  try {
    const bufferSecretKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', bufferSecretKey, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { bufferSecretKey, encryptedText: iv.toString('hex') + encrypted };
  } catch (error) {
    throw new Error("Something Went Wrong");
  }
}

const decrypt = (encryptedText, bufferSecretKey) => {
  try {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', bufferSecretKey, iv);
    let decrypted = decipher.update(encryptedText.slice(32), 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  } catch (error) {
    throw new Error("Something Went Wrong");
  }
}

export { encrypt, decrypt };
