package io.alastria.id.serviceprovider.api;

import java.util.ArrayList;
import java.util.List;

public class Storage {

	private static List<String> allowedIDs = new ArrayList<>();

	private Storage() {}


	public static void addToAuthorized(Authorization auth) {
		allowedIDs.add(auth.getUser().getData().getIss());
	}


	public static boolean isAuthorized(String id) {
		return allowedIDs.contains(id);
	}


	public static void remove(String text) {
		allowedIDs.remove(text);

	}

}
