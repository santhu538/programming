package com.hack2hire.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hack2hire.model.SubmitReviewRq;
import com.hack2hire.model.SubmitUserPreferencesRq;
import com.hack2hire.model.UserDetails;
import com.hack2hire.model.UserRq;
import com.hack2hire.service.IUserService;

@RestController
public class UserAPI {
	
	@Autowired
	IUserService userService;
	
	Logger log = LoggerFactory.getLogger(getClass());
	
	@PostMapping("/users")
	public ResponseEntity<?> registerUser(@RequestBody UserRq userRq) {
		
		log.info("====== registerUser ========");
		UserDetails userDetails = userService.registerUser(userRq);
		
		return ResponseEntity.ok(userDetails);
		
	}
	
	@GetMapping("/users/{userid}")
	public ResponseEntity<?> readUser(@PathVariable("userid")String userid) {
		log.info("====== readUser ==========user id {}",userid);
		UserDetails userDetails = userService.fetchUserDetails(userid);
		
		return ResponseEntity.ok(userDetails);
		
	}
	
	
	@PostMapping("/users/review")
	public ResponseEntity<?> submitReview(@RequestBody SubmitReviewRq submitReviewRq) { 
		log.info("====== submitReview ========");
		boolean result = userService.submitReview(submitReviewRq);
		
		if(result) {
			return ResponseEntity.ok("Review submitted successfully");
		}
		else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		
	}
	
	@PostMapping("/users/preferences")
	public ResponseEntity<?> submitUserPreferences(@RequestBody SubmitUserPreferencesRq submitUserPreferencesRq) { 
		log.info("====== submitReview ========");
		boolean result = userService.submitUserPreferences(submitUserPreferencesRq);
		
		if(result) {
			return ResponseEntity.ok("Review submitted successfully");
		}
		else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		
	}

}
