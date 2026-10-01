package com.schedule.dailyschedule.service;

import com.schedule.dailyschedule.dto.ActivityRequest;
import com.schedule.dailyschedule.dto.ActivityResponse;
import com.schedule.dailyschedule.dto.DailySummaryResponse;
import com.schedule.dailyschedule.exception.ResourceNotFoundException;
import com.schedule.dailyschedule.model.Activity;
import com.schedule.dailyschedule.model.ActivityPriority;
import com.schedule.dailyschedule.model.ActivityStatus;
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
    public List<ActivityResponse> getActivities(LocalDate date, ActivityStatus status, String category) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<Activity> activities;

        if (status != null) {
            activities = activityRepository.findByScheduleDateAndStatusOrderByStartTimeAscOrderIndexAscCreatedAtAsc(targetDate, status);
        } else if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            activities = activityRepository.findByScheduleDateAndCategoryIgnoreCaseOrderByStartTimeAscOrderIndexAscCreatedAtAsc(targetDate, category.trim());
        } else {
            activities = activityRepository.findByScheduleDateOrderByStartTimeAscOrderIndexAscCreatedAtAsc(targetDate);
        }

        return activities.stream()
                .map(ActivityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByDateRange(LocalDate start, LocalDate end) {
        LocalDate startDate = (start != null) ? start : LocalDate.now();
        LocalDate endDate = (end != null) ? end : startDate.plusDays(7);
        return activityRepository.findByScheduleDateBetweenOrderByScheduleDateAscStartTimeAscOrderIndexAsc(startDate, endDate)
                .stream()
                .map(ActivityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ActivityResponse getActivityById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        return ActivityResponse.fromEntity(activity);
    }

    public ActivityResponse createActivity(ActivityRequest request) {
        Activity activity = new Activity();
        activity.setTitle(request.getTitle().trim());
        activity.setDescription(request.getDescription());
        activity.setScheduleDate(request.getScheduleDate() != null ? request.getScheduleDate() : LocalDate.now());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setStatus(request.getStatus() != null ? request.getStatus() : ActivityStatus.NOT_STARTED);
        activity.setPriority(request.getPriority() != null ? request.getPriority() : ActivityPriority.MEDIUM);
        activity.setCategory((request.getCategory() != null && !request.getCategory().isBlank()) ? request.getCategory().trim() : "General");
        activity.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);

        Activity saved = activityRepository.save(activity);
        return ActivityResponse.fromEntity(saved);
    }

    public ActivityResponse updateActivity(Long id, ActivityRequest request) {
        Activity activity = activityRepository.findById(id)
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

    public ActivityResponse updateStatus(Long id, ActivityStatus status) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        activity.setStatus(status);
        Activity updated = activityRepository.save(activity);
        return ActivityResponse.fromEntity(updated);
    }

    public void deleteActivity(Long id) {
        if (!activityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Activity not found with id: " + id);
        }
        activityRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DailySummaryResponse getDailySummary(LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        long total = activityRepository.countByScheduleDate(targetDate);
        long completed = activityRepository.countByScheduleDateAndStatus(targetDate, ActivityStatus.COMPLETED);
        long ongoing = activityRepository.countByScheduleDateAndStatus(targetDate, ActivityStatus.ONGOING);
        long notStarted = activityRepository.countByScheduleDateAndStatus(targetDate, ActivityStatus.NOT_STARTED);

        return new DailySummaryResponse(targetDate, total, completed, ongoing, notStarted);
    }
}
