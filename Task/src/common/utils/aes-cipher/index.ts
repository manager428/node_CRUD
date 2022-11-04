import crypto from 'crypto';

const aes256gcm = (key: string) => {

    const ALGO = 'aes-256-gcm';

    const encrypt = (str: string) => {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGO, key, iv);

        // Hint: Larger inputs (it's GCM, after all!) should use the stream API
        let enc = cipher.update(str, 'utf8', 'base64');
        enc += cipher.final('base64');
        return {
            enc, iv, authTag: cipher.getAuthTag()
        };
    };

    // decrypt decodes base64-encoded ciphertext into a utf8-encoded string
    const decrypt = (enc: string, iv: Buffer, authTag: Buffer) => {
        const decipher = crypto.createDecipheriv(ALGO, key, iv);
        decipher.setAuthTag(authTag);
        let str = decipher.update(enc, 'base64', 'utf8');
        str += decipher.final('utf8');
        return str;

    };
    return {
        encrypt,
        decrypt
    };
};

export default aes256gcm;