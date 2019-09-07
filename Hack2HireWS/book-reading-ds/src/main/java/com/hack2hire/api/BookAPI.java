package com.hack2hire.api;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hack2hire.model.BookDetails;
import com.hack2hire.model.PublishBookRq;
import com.hack2hire.model.UserBooksRs;
import com.hack2hire.service.IBookService;

@RestController
public class BookAPI {
	
	Logger log = LoggerFactory.getLogger(getClass());
	
	@RequestMapping("/healthcheck")
	public ResponseEntity<String> healthCheck() {
		return ResponseEntity.ok("success");
	}
	
	@Autowired
	IBookService bookService;
	
	@PostMapping("/books")
	public ResponseEntity<String> publishBook(@RequestBody PublishBookRq publishBookRq) {
		
		bookService.publishBook(publishBookRq);
		
		
		return ResponseEntity.ok("success");
	}
	
	@GetMapping("/books/users/{userid}")
	public ResponseEntity<?> retrieveBooks(@PathVariable("userid") String userid) {
		
		log.info("Reading books of a user {}",userid);
		List<BookDetails> bookDetailsList = bookService.retrieveBooksOfUser(userid);
		UserBooksRs userBooksRs = new UserBooksRs();
		userBooksRs.setBookDetailsList(bookDetailsList);
		log.info("bookDetailsList size "+bookDetailsList.size());
		
		return ResponseEntity.ok(userBooksRs);
	}
	
	@GetMapping("/books")
	public ResponseEntity<?> retrieveAllBooks() {
		
		log.info("Reading books of a user {}");
		List<BookDetails> bookDetailsList = bookService.retrieveAllBooks();
		UserBooksRs userBooksRs = new UserBooksRs();
		userBooksRs.setBookDetailsList(bookDetailsList);
		log.info("bookDetailsList size "+bookDetailsList.size());
		
		return ResponseEntity.ok(userBooksRs);
	}
}
