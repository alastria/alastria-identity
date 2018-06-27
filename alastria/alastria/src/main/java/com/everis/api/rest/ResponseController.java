package com.everis.api.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.everis.domain.ResponsePubKey;
import com.fasterxml.jackson.databind.ObjectMapper;

import utils.PublicKeyManager;

@RestController
public class ResponseController {
 
    @RequestMapping(value = "/alastria/pubkey/{alastria_id}", method = RequestMethod.GET, produces = { "application/json"})
    public @ResponseBody ResponseEntity<String> 
    getPubKey( @PathVariable("alastria_id") final String alastria_id) throws Exception {
    	
    	PublicKeyManager publicKeyManager = new PublicKeyManager();
    	if(publicKeyManager.existeIdentidad(alastria_id)){
    		ResponsePubKey responsePubKey = new ResponsePubKey(alastria_id, publicKeyManager.getPublicKey(alastria_id));
    		final String result = new ObjectMapper().writeValueAsString(responsePubKey);
            return new ResponseEntity<String>(result, HttpStatus.OK);
    	}
    	else{
            return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
    	}
        
    }
  
}