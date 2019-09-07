package com.hack2hire.model;

import java.util.List;

import com.hack2hire.entities.Book;

public class BookDetails {
	
	private Book book;
	private List<ReviewRs> reviewRsList;
	private Double avgRating;
	
	public Book getBook() {
		return book;
	}
	public void setBook(Book book) {
		this.book = book;
	}
	public List<ReviewRs> getReviewRsList() {
		return reviewRsList;
	}
	public void setReviewRsList(List<ReviewRs> reviewRsList) {
		this.reviewRsList = reviewRsList;
	}
	public Double getAvgRating() {
		return avgRating;
	}
	public void setAvgRating(Double avgRating) {
		this.avgRating = avgRating;
	}
	
	
}
