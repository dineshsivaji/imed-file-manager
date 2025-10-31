use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use base64::prelude::*;
use rand::RngCore;
use sha2::{Digest, Sha256};
use std::fs;

type Aes256CbcEnc = cbc::Encryptor<aes::Aes256>;
type Aes256CbcDec = cbc::Decryptor<aes::Aes256>;

pub fn decrypt_file(file_path: &str, key: &[u8; 32]) -> String {
    let ciphertext = fs::read(file_path).expect("Failed to read the file");
    let ciphertext_str = String::from_utf8(ciphertext).expect("File content is not valid UTF-8");

    let plaintext = decrypt(&key, &ciphertext_str);
    String::from_utf8_lossy(&plaintext).to_string()
}

pub fn encrypt_file(input_file: &str, key: &[u8; 32], output_file: Option<&str>) -> bool {
    let plaintext = fs::read(input_file).expect("Failed to read the file");
    let ciphertext = encrypt(&key, &plaintext);
    let default_output = {
        let path = std::path::Path::new(input_file);
        let base_name = path.file_stem().unwrap_or_default().to_string_lossy();
        let extension = path
            .extension()
            .map_or(String::new(), |ext| format!(".{}", ext.to_string_lossy()));
        let parent_dir = path.parent().unwrap_or_else(|| std::path::Path::new(""));
        parent_dir.join(format!("{}_encrypted{}", base_name, extension))
    };
    let target_file = output_file.map_or_else(|| default_output.to_str().unwrap(), |s| s);
    println!("target_file: {}", target_file);
    fs::write(target_file, ciphertext).is_ok()
}

// Generate a 32-byte key from a string
pub fn generate_key(key_string: &str) -> [u8; 32] {
    let hash = Sha256::digest(key_string.as_bytes());
    let mut key = [0u8; 32];
    key.copy_from_slice(&hash);
    key
}

pub fn encrypt(key: &[u8; 32], plaintext: &[u8]) -> String {
    let mut iv = [0u8; 16];
    rand::rng().fill_bytes(&mut iv);
    // rand::rng().fill_bytes(iv.as_mut_slice());

    let block_size = 16;
    let mut buf = vec![0u8; plaintext.len() + block_size];
    let ciphertext_len = Aes256CbcEnc::new(key.into(), (&iv).into())
        .encrypt_padded_b2b_mut::<Pkcs7>(plaintext, &mut buf)
        .unwrap()
        .len();
    let ciphertext = &buf[..ciphertext_len];
    BASE64_STANDARD.encode([iv.to_vec(), ciphertext.to_vec()].concat())
}

pub fn decrypt(key: &[u8; 32], ciphertext: &str) -> Vec<u8> {
    let ciphertext_bytes = BASE64_STANDARD.decode(ciphertext).unwrap();
    let (iv, ciphertext) = ciphertext_bytes.split_at(16);
    let mut buf = vec![0u8; ciphertext.len()];
    let plaintext_len = Aes256CbcDec::new(key.into(), iv.into())
        .decrypt_padded_b2b_mut::<Pkcs7>(ciphertext, &mut buf)
        .unwrap()
        .len();
    buf[..plaintext_len].to_vec()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    fn test_encryption_decryption() {
        let key_string = env::var("ENCRYPTION_KEY").expect("Missing ENCRYPTION_KEY env var");
        let key = generate_key(&key_string);

        let plaintext = b"hello world! this is my plaintext.";

        let ct = encrypt(&key, plaintext);
        let pt = decrypt(&key, &ct);

        assert_eq!(pt, plaintext);
    }
}
