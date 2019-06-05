package io.alastria.id.serviceprovider.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORS implements WebMvcConfigurer {

	 @Override
	  public void addCorsMappings(CorsRegistry registry) {

	    registry.addMapping("/api/login")
	        .allowedOrigins("*")
	        .allowedMethods("*")
	        .allowedHeaders("*")
	        .allowCredentials(false)
	        .maxAge(6000);

	  }

}