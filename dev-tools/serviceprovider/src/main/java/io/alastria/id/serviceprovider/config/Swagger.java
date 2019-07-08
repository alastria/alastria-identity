package io.alastria.id.serviceprovider.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.common.base.Predicates;

import springfox.documentation.service.Contact;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class Swagger {
	
	@Bean
	public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2)
				.useDefaultResponseMessages(false)
				.select()
				.apis(RequestHandlerSelectors.basePackage("io.alastria.id.serviceprovider.api"))
				.paths(Predicates.not(PathSelectors.regex("/error")))
				.build()
				.apiInfo(apiInfo());
	}

	private ApiInfo apiInfo() {
		
		return new ApiInfoBuilder().title("Service Provider API")
				.description("Providing services in AlastriaID Ecosystem")
				.version("1.0")
				.license("Apache-2.0")				
				.licenseUrl("https://apache.org/licenses/LICENSE-2.0")
				.contact(new Contact("Eduardo Sánchez Mata", "https://github.com/esanchma", "eduardo.sanchez.mata@everis.com"))
				.build();
	}

}
