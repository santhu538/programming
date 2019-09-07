package com.hack2hire.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hack2hire.entities.UserPreferences;

public interface UserPreferencesRepo extends JpaRepository<UserPreferences, Integer>{

}
