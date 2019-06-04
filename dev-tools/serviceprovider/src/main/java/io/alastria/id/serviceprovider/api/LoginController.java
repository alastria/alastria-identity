package io.alastria.id.serviceprovider.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/login")
@Api(tags = { "login callback" })
public class LoginController {

	@RequestMapping(value = "/", method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.OK)
	@ApiOperation(value = "Receives a DID Document for login")

	@ApiResponses(value = { @ApiResponse(code = 200, message = "Identity is valid"),
			@ApiResponse(code = 404, message = "Identity is not valid") })

	public void save(@ApiParam(value = "DID Document", required = true) @RequestBody AlastriaDIDDocument user) {
		log.info(user.toString());
		// TODO: Storage.addToAuthorized(user.id);
	}
}
