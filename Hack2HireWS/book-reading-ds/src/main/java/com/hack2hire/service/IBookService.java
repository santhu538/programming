package com.hack2hire.service;

import java.util.List;

import com.hack2hire.entities.Book;
import com.hack2hire.model.BookDetails;
import com.hack2hire.model.PublishBookRq;

public interface IBookService {
	public BookDetails retrieveReviews(Book book);
	public List<BookDetails> retrieveBooksOfUser(String userid);
	public boolean publishBook(PublishBookRq publishBookRq);
	public List<BookDetails> retrieveAllBooks();
}
