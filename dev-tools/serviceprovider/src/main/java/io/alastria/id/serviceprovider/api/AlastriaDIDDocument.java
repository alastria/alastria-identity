package io.alastria.id.serviceprovider.api;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AlastriaDIDDocument {

	@JsonProperty(value = "@context")
	String context;
	
	String id;
	
	PublicKey publicKey;
	
}
