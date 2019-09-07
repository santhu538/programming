package com.hack2hire.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hack2hire.entities.Book;
import com.hack2hire.entities.User;

public interface BookRepo extends JpaRepository<Book, Integer>{
	
	
	List<Book> findByUser(User user);
	
	List<Book> findAll();
	
}
