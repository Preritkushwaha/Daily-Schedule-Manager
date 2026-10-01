package com.schedule.dailyschedule.dto;

import com.schedule.dailyschedule.model.Activity;
import com.schedule.dailyschedule.model.ActivityPriority;
import com.schedule.dailyschedule.model.ActivityStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ActivityResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private ActivityStatus status;
    private ActivityPriority priority;
    private String category;
    private Integer orderIndex;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ActivityResponse() {
    }

    public static ActivityResponse fromEntity(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setTitle(activity.getTitle());
        response.setDescription(activity.getDescription());
        response.setScheduleDate(activity.getScheduleDate());
        response.setStartTime(activity.getStartTime());
        response.setEndTime(activity.getEndTime());
        response.setStatus(activity.getStatus());
        response.setPriority(activity.getPriority());
        response.setCategory(activity.getCategory());
        response.setOrderIndex(activity.getOrderIndex());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(LocalDate scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public ActivityStatus getStatus() {
        return status;
    }

    public void setStatus(ActivityStatus status) {
        this.status = status;
    }

    public ActivityPriority getPriority() {
        return priority;
    }

    public void setPriority(ActivityPriority priority) {
        this.priority = priority;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
