package com.hack2hire.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hack2hire.entities.User;
import java.lang.String;

public interface UserRepo extends JpaRepository<User, String> {
	
	List<User> findAll();
	

}
