package com.everis.domain;

import java.math.BigInteger;

public class KeyPair {

	private final String privateKey;
    private final String publicKey;
	
    public KeyPair(String publicKey, String privateKey) {
		this.publicKey = publicKey;
		this.privateKey = privateKey;
	}

	public String getPrivateKey() {
		return privateKey;
	}

	public String getPublicKey() {
		return publicKey;
	}

	@Override
	public String toString() {
		return "KeyPair [privateKey=" + privateKey + ", publicKey=" + publicKey + "]";
	}
	
	
}
