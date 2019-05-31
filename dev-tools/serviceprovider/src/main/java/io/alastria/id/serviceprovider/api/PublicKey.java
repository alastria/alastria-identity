package io.alastria.id.serviceprovider.api;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class PublicKey {
	
	String id;
	
	List<String> type;
	
	String curve;
	
	Date expires;
	
	String publicKeyHex;

}
