package com.hack2hire.entities;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity(name = "book")
public class Book {
	
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer book_id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "language")
	private String langage;
	
	@Column(name = "thumbnail")
	private String thumbnail;
	
	@Column(name = "synopsis")
	private String synopsis;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private Set<UserReview> userReviews;

	public Set<UserReview> getUserReviews() {
		return userReviews;
	}

	public void setUserReviews(Set<UserReview> userReviews) {
		this.userReviews = userReviews;
	}

	public Integer getBook_id() {
		return book_id;
	}

	public void setBook_id(Integer book_id) {
		this.book_id = book_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLangage() {
		return langage;
	}

	public void setLangage(String langage) {
		this.langage = langage;
	}

	public String getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getSynopsis() {
		return synopsis;
	}

	public void setSynopsis(String synopsis) {
		this.synopsis = synopsis;
	}
	
	
	
}
