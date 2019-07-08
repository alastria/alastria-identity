package io.alastria.id.serviceprovider.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import io.alastria.id.serviceprovider.api.Storage;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AuthSocketHandler implements WebSocketHandler {

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		log.debug("Incoming websocket connection from {}", session.getRemoteAddress());
		session.sendMessage(new TextMessage("CONNECTED".getBytes()));

	}

	@Override
	public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
		if (message instanceof TextMessage) {
			TextMessage textMessage = (TextMessage) message;
			String text = textMessage.getPayload();
			log.trace("incoming websocket message: {}", text);
			if(Storage.isAuthorized(text)) {
				session.sendMessage(new TextMessage("OK".getBytes()));
				Storage.remove(text);
			}

		} else {
			log.error("Incoming websocket message has an extraneous type");
		}

	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		log.error("websocket transport error", exception);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		log.debug("websocket connection closed from {}", session.getRemoteAddress());
	}

	@Override
	public boolean supportsPartialMessages() {
		return false;
	}
}
