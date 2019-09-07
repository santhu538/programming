package com.hack2hire.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.hack2hire.entities.Book;
import com.hack2hire.entities.User;
import com.hack2hire.entities.UserPreferences;
import com.hack2hire.entities.UserReview;
import com.hack2hire.model.SubmitReviewRq;
import com.hack2hire.model.SubmitUserPreferencesRq;
import com.hack2hire.model.UserDetails;
import com.hack2hire.model.UserReviewRs;
import com.hack2hire.model.UserRq;
import com.hack2hire.repo.BookRepo;
import com.hack2hire.repo.UserPreferencesRepo;
import com.hack2hire.repo.UserRepo;
import com.hack2hire.repo.UserReviewRepo;

@Service
public class UserService implements IUserService {

	@Autowired
	UserRepo userRepo;
	
	@Autowired
	BookRepo bookRepo;
	
	@Autowired
	UserReviewRepo userReviewRepo;
	
	@Autowired
	UserPreferencesRepo userPreferencesRepo;
	
	Logger log = LoggerFactory.getLogger(getClass());
	
	@Override
	public boolean submitReview(SubmitReviewRq submitReviewRq) {
		
		try {
		User user = readUser(submitReviewRq.getUserid());
		Book book = bookRepo.getOne(submitReviewRq.getBookid());
		
		UserReview userReview = new UserReview();
		userReview.setBook(book);
		userReview.setUser(user);
		userReview.setReview(submitReviewRq.getReview());
		userReview.setRating(submitReviewRq.getRating());
		
		userReviewRepo.save(userReview);
		return true;
		}
		catch(DataAccessException dae) {
			return false;
		}
	}

	private User readUser(String userid) {
		return userRepo.getOne(userid);
	}

	@Override
	public List<UserReviewRs> retrieveReviews(String userid) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserDetails fetchUserDetails(User user) {
		UserDetails userDetails = new UserDetails();
		userDetails.setAge(user.getAge());
		userDetails.setLocation(user.getLocation());
		userDetails.setEmail(user.getEmail());
		userDetails.setName(user.getName());
		userDetails.setUserid(user.getUserid());
		return userDetails;
	}
	
	@Override
	public UserDetails fetchUserDetails(String userid) {
		
		User user = userRepo.getOne(userid);
		return fetchUserDetails(user);
	}

	@Override
	public UserDetails registerUser(@RequestBody UserRq userRq) {
		
		log.info(" ========== UserService: registerUser ==========");
		//if(log.isDebugEnabled()) {
			log.info("Age "+userRq.getAge());
			log.info("name "+userRq.getName());
			log.info("email "+userRq.getEmail());
		//}
		User user = new User();
		user.setAge(userRq.getAge());
		user.setEmail(userRq.getEmail());
		user.setName(userRq.getName());
		user.setUserid(userRq.getUserid());
		user.setLocation(userRq.getLocation());
		user.setPassword(userRq.getPassword());
		userRepo.save(user);
		
		
		return fetchUserDetails(user);
	}

	@Override
	public boolean submitUserPreferences(SubmitUserPreferencesRq submitUserPreferencesRq) {
		try {
		User user = userRepo.getOne(submitUserPreferencesRq.getUserid());
		UserPreferences userPreferences = new UserPreferences();
		userPreferences.setGenre(submitUserPreferencesRq.getGenre());
		userPreferences.setLangage(submitUserPreferencesRq.getLanguage());
		userPreferences.setUser(user);
		userPreferencesRepo.save(userPreferences);
		return true;
		}
		catch(DataAccessException dae) {
			log.error("Exception in persisinting User preferences",dae.getMessage());
			return false;
		}
	}

}
