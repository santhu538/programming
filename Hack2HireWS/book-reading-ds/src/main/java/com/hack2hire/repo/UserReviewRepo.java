package com.hack2hire.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hack2hire.entities.Book;
import com.hack2hire.entities.UserReview;

public interface UserReviewRepo extends JpaRepository<UserReview, Integer> {
	
	List<UserReview> findByBook(Book book);
}
