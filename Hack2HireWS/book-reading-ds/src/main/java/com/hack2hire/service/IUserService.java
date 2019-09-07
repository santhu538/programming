package com.hack2hire.service;

import java.util.List;

import com.hack2hire.entities.User;
import com.hack2hire.model.SubmitReviewRq;
import com.hack2hire.model.SubmitUserPreferencesRq;
import com.hack2hire.model.UserDetails;
import com.hack2hire.model.UserReviewRs;
import com.hack2hire.model.UserRq;

public interface IUserService {

	public boolean submitReview(SubmitReviewRq submitReviewRq);
	
	public List<UserReviewRs> retrieveReviews(String userid);

	public UserDetails fetchUserDetails(User user);
	
	public UserDetails registerUser(UserRq userRq);

	UserDetails fetchUserDetails(String userid);

	public boolean submitUserPreferences(SubmitUserPreferencesRq submitUserPreferencesRq);
	
}
