package com.schedule.dailyschedule.service;

import com.schedule.dailyschedule.dto.ActivityRequest;
import com.schedule.dailyschedule.dto.ActivityResponse;
import com.schedule.dailyschedule.dto.DailySummaryResponse;
import com.schedule.dailyschedule.exception.ResourceNotFoundException;
import com.schedule.dailyschedule.model.Activity;
import com.schedule.dailyschedule.model.ActivityStatus;
import com.schedule.dailyschedule.model.User;
import com.schedule.dailyschedule.repository.ActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivities(User user, LocalDate date, ActivityStatus status, String category) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<Activity> activities;

        if (status != null) {
            activities = activityRepository.findByUserAndScheduleDateAndStatusOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
                    user, targetDate, status);
        } else if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            activities = activityRepository.findByUserAndScheduleDateAndCategoryIgnoreCaseOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
                    user, targetDate, category.trim());
        } else {
            activities = activityRepository.findByUserAndScheduleDateOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
                    user, targetDate);
        }

        return activities.stream()
                .map(ActivityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByDateRange(User user, LocalDate start, LocalDate end) {
        LocalDate startDate = (start != null) ? start : LocalDate.now();
        LocalDate endDate = (end != null) ? end : startDate.plusDays(7);
        return activityRepository.findByUserAndScheduleDateBetweenOrderByScheduleDateAscStartTimeAscOrderIndexAsc(
                        user, startDate, endDate)
                .stream()
                .map(ActivityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ActivityResponse getActivityById(User user, Long id) {
        Activity activity = activityRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        return ActivityResponse.fromEntity(activity);
    }

    public ActivityResponse createActivity(User user, ActivityRequest request) {
        Activity activity = new Activity();
        activity.setUser(user);
        activity.setTitle(request.getTitle().trim());
        activity.setDescription(request.getDescription());
        activity.setScheduleDate(request.getScheduleDate() != null ? request.getScheduleDate() : LocalDate.now());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setStatus(request.getStatus() != null ? request.getStatus() : ActivityStatus.NOT_STARTED);
        activity.setPriority(request.getPriority() != null ? request.getPriority() : request.getPriority());
        activity.setCategory((request.getCategory() != null && !request.getCategory().isBlank()) ? request.getCategory().trim() : "General");
        activity.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);

        Activity saved = activityRepository.save(activity);
        return ActivityResponse.fromEntity(saved);
    }

    public ActivityResponse updateActivity(User user, Long id, ActivityRequest request) {
        Activity activity = activityRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        activity.setTitle(request.getTitle().trim());
        activity.setDescription(request.getDescription());
        if (request.getScheduleDate() != null) {
            activity.setScheduleDate(request.getScheduleDate());
        }
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        if (request.getStatus() != null) {
            activity.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            activity.setPriority(request.getPriority());
        }
        if (request.getCategory() != null && !request.getCategory().isBlank()) {
            activity.setCategory(request.getCategory().trim());
        }
        if (request.getOrderIndex() != null) {
            activity.setOrderIndex(request.getOrderIndex());
        }

        Activity updated = activityRepository.save(activity);
        return ActivityResponse.fromEntity(updated);
    }

    public ActivityResponse updateStatus(User user, Long id, ActivityStatus status) {
        Activity activity = activityRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        activity.setStatus(status);
        Activity updated = activityRepository.save(activity);
        return ActivityResponse.fromEntity(updated);
    }

    public void deleteActivity(User user, Long id) {
        Activity activity = activityRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        activityRepository.delete(activity);
    }

    @Transactional(readOnly = true)
    public DailySummaryResponse getDailySummary(User user, LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        long total = activityRepository.countByUserAndScheduleDate(user, targetDate);
        long completed = activityRepository.countByUserAndScheduleDateAndStatus(user, targetDate, ActivityStatus.COMPLETED);
        long ongoing = activityRepository.countByUserAndScheduleDateAndStatus(user, targetDate, ActivityStatus.ONGOING);
        long notStarted = activityRepository.countByUserAndScheduleDateAndStatus(user, targetDate, ActivityStatus.NOT_STARTED);

        return new DailySummaryResponse(targetDate, total, completed, ongoing, notStarted);
    }
}
