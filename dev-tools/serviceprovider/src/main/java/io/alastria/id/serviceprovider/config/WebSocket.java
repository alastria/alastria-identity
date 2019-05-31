package io.alastria.id.serviceprovider.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import io.alastria.id.serviceprovider.websocket.AuthSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocket implements WebSocketConfigurer {

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(new AuthSocketHandler(), "/auth");

	}

}
