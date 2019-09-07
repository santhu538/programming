package com.hack2hire.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "user_review")
public class UserReview {
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer user_review_id;
	
	
	@ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
	
	@ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;
	
	@Column(name = "review")
	private String review;
	
	@Column(name = "synopsis")
	private String synopsis;
	
	@Column(name = "rating")
	private Integer rating;

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public Integer getUser_review_id() {
		return user_review_id;
	}

	public void setUser_review_id(Integer user_review_id) {
		this.user_review_id = user_review_id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public String getReview() {
		return review;
	}

	public void setReview(String review) {
		this.review = review;
	}

	public String getSynopsis() {
		return synopsis;
	}

	public void setSynopsis(String synopsis) {
		this.synopsis = synopsis;
	}
	
	
	
}
