package io.alastria.id.serviceprovider.api;

import lombok.Data;

@Data
public class Authorization {

	AlastriaDIDDocument user;
	
	public Authorization(AlastriaDIDDocument did) {
		user = did;
	}
	
	@SuppressWarnings("unused")
	private Authorization() {}

	public boolean isValid() {
		return user.getData().getIss().startsWith("did:ala:quor:telsius:0x");
	}


}
