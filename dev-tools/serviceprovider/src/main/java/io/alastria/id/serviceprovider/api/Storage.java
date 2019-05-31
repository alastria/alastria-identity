package io.alastria.id.serviceprovider.api;

import java.util.ArrayList;
import java.util.List;

public class Storage {
	
	private static List<String> allowedIDs = new ArrayList<>();
	
	private Storage() {}
	
	
	public static void addToAuthorized(String id) {
		allowedIDs.add(id);
	}
	
	public static boolean isAuthorized(String id) {
		return allowedIDs.contains(id);
	}
	
}
