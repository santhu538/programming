package com.hack2hire.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.hack2hire.entities.Book;
import com.hack2hire.entities.User;
import com.hack2hire.entities.UserReview;
import com.hack2hire.model.BookDetails;
import com.hack2hire.model.PublishBookRq;
import com.hack2hire.model.ReviewRs;
import com.hack2hire.model.UserDetails;
import com.hack2hire.repo.BookRepo;
import com.hack2hire.repo.UserRepo;
import com.hack2hire.repo.UserReviewRepo;

@Service
public class BookService implements IBookService {

	@Autowired
	BookRepo bookRepo;
	
	@Autowired
	UserReviewRepo userReviewRepo;
	
	@Autowired
	UserRepo userRepo;
	
	@Autowired
	IUserService userService;
	
	Logger log = LoggerFactory.getLogger(BookService.class);
	
	@Override
	public BookDetails retrieveReviews(Book book) {
		
		log.info("========== retrieveReviews ===========");
		
		BookDetails bookDetails = new BookDetails();
		
		bookDetails.setBook(book);
		List<UserReview> userReviews = userReviewRepo.findByBook(book);
		
		if(userReviews == null || userReviews.size() == 0) {
			log.info("No user reviews found");
			return bookDetails;
		}
		
		int totalRating = 0;
		
		for(UserReview userReview:userReviews) {
			
			UserDetails userDetails = userService.fetchUserDetails(userReview.getUser());
			ReviewRs reviewRs = new ReviewRs();
			reviewRs.setUserDetails(userDetails);
			reviewRs.setReview(userReview.getReview());
			totalRating += userReview.getRating();
			reviewRs.setRating(userReview.getRating());
		}
		
		double avgRating = totalRating/userReviews.size();
		bookDetails.setAvgRating(avgRating);
		
		log.info("avgRating "+avgRating);
		
		return bookDetails;
	}

	@Override
	public List<BookDetails> retrieveBooksOfUser(String userid) {
		User user = userRepo.getOne(userid);
		List<Book> books = bookRepo.findByUser(user);
		
		log.info("books size {}",books.size());
		
		List<BookDetails> bookDetailsList = new ArrayList<>(1);
		
		for(Book book:books) {
			bookDetailsList.add(retrieveReviews(book));
		}
		
		return bookDetailsList;
	}

	@Override
	public boolean publishBook(PublishBookRq publishBookRq) {
		try {
		Book book = new Book();
		book.setName(publishBookRq.getBookName());
		book.setLangage(publishBookRq.getLanguage());
		book.setSynopsis(publishBookRq.getSynopsis());
		book.setThumbnail(publishBookRq.getThumbnail());
		book.setUser(userRepo.getOne(publishBookRq.getUserid()));
		bookRepo.save(book);
		}
		catch(DataAccessException dae) {
			log.error("Exception in saving book details ",dae.getMessage());
		}
		return true;
	}

	@Override
	public List<BookDetails> retrieveAllBooks() {
		List<Book> books = bookRepo.findAll();
		List<BookDetails> bookDetailsList = new ArrayList<>(1);
		for(Book book:books) {
			bookDetailsList.add(retrieveReviews(book));
		}
		return bookDetailsList;
	}

}
