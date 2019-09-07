package com.hack2hire.model;

import java.util.ArrayList;
import java.util.List;

public class UserReviewRs {
	private List<ReviewRs> reviewRsList = new ArrayList<>();
	private UserDetails userDetails = null;

	public List<ReviewRs> getReviewRsList() {
		return reviewRsList;
	}

	public void setReviewRsList(List<ReviewRs> reviewRsList) {
		this.reviewRsList = reviewRsList;
	}

	public UserDetails getUserDetails() {
		return userDetails;
	}

	public void setUserDetails(UserDetails userDetails) {
		this.userDetails = userDetails;
	}
}
