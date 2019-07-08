package io.alastria.id.serviceprovider.api;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class AlastriaDIDDocument {

	@JsonProperty(value = "@context",required = false)
	@ApiModelProperty(example = "https://w3id.org/did/v1", required = false)
	String context;
	
	@ApiModelProperty(required = true, value="issuer", example = "did:ala:quor:telsius:0x123ABC")
	String iss;
	
	@ApiModelProperty(required = true, value="shared private secret", example = "your-256-bit-secret")
	String pku;
	
	@JsonDeserialize(using = UnixTimestampDeserializer.class)
	@ApiModelProperty(required = true, value="issued at (in timestamp format)", example = "1559555201491")
	Date iat;
	
	@JsonDeserialize(using = UnixTimestampDeserializer.class)
	@ApiModelProperty(required = true, value="expiration (in timestamp format)", example = "1559555201491")
	Date exp;
	
	@JsonDeserialize(using = UnixTimestampDeserializer.class)
	@ApiModelProperty(required = true, value="not before (in timestamp format)", example = "1559555201491")
	Date nbf;
	
	AlastriaDIDDocumentData data;
}
