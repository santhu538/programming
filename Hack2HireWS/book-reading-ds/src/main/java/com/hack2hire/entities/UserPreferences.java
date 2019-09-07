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
@Table(name = "user_preferences")
public class UserPreferences {
	

	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer user_pref_id;
	
	@Column(name = "genre")
	private String genre;
	
	@Column(name = "language")
	private String langage;
	
	@ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

	public Integer getUser_pref_id() {
		return user_pref_id;
	}

	public void setUser_pref_id(Integer user_pref_id) {
		this.user_pref_id = user_pref_id;
	}

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public String getLangage() {
		return langage;
	}

	public void setLangage(String langage) {
		this.langage = langage;
	}
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	
}
