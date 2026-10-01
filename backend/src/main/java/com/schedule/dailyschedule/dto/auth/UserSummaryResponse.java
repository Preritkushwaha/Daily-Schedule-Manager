package com.schedule.dailyschedule.dto.auth;

import com.schedule.dailyschedule.model.User;

public class UserSummaryResponse {

    private Long id;
    private String name;
    private String email;

    public UserSummaryResponse() {
    }

    public UserSummaryResponse(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public static UserSummaryResponse fromEntity(User user) {
        if (user == null) return null;
        return new UserSummaryResponse(user.getId(), user.getName(), user.getEmail());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
