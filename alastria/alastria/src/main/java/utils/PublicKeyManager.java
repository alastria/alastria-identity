package utils;

import java.util.Hashtable;

import com.everis.domain.KeyPair;

public class PublicKeyManager {

	private Hashtable<String, KeyPair> identidades = new Hashtable<String, KeyPair>();
	
	public PublicKeyManager() {
		KeyPair keyPair1 = new KeyPair("0xD4186f63f08B3ef143c90A90a80791c795C3Bf39", "0x84ab5eea911cd5953c0bf9735031cfaa2eb99c53260a26d2fc08adcc792ff879");
		KeyPair keyPair2 = new KeyPair("0x52F50609465CcaDa390a155Fe7303F3e5DF843Dc", "0xbd9b99459aa6496b0d34b466f8920517e27825ad0b72ab385fd627fad2529198");
		KeyPair keyPair3 = new KeyPair("0xC0fA90fc597b7794F4a1cd58dd1A4C4e331c0F35", "0x9e402901e7b378fc595d5fc625e94eeb671d06f210e0db65c95bf9fac4877169");
		
		this.identidades.put("alastriaId01", keyPair1);
		this.identidades.put("alastriaId02", keyPair2);
		this.identidades.put("alastriaId03", keyPair3);
	}
	
	public Boolean existeIdentidad(String alstriaId){
		return this.identidades.containsKey(alstriaId);
	}
	
	public String getPublicKey(String alstriaId){
		return this.identidades.get(alstriaId).getPublicKey();
	}
	
}
