package com.everis.domain;

public class ResponsePubKey {

	private String alastria_id;
	private String pubkey;
	
	public ResponsePubKey(String alastriaId, String pubkey) {
		this.alastria_id = alastriaId;
		this.pubkey = pubkey;
	}

	public String getAlastriaId() {
		return alastria_id;
	}

	public String getPubkey() {
		return pubkey;
	}

	public void setAlastriaId(String alastriaId) {
		this.alastria_id = alastriaId;
	}

	public void setPubkey(String pubkey) {
		this.pubkey = pubkey;
	}
	
}
