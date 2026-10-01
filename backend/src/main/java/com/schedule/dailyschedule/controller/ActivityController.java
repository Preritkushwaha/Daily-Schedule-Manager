package com.schedule.dailyschedule.controller;

import com.schedule.dailyschedule.dto.ActivityRequest;
import com.schedule.dailyschedule.dto.ActivityResponse;
import com.schedule.dailyschedule.dto.DailySummaryResponse;
import com.schedule.dailyschedule.dto.StatusUpdateRequest;
import com.schedule.dailyschedule.model.ActivityStatus;
import com.schedule.dailyschedule.model.User;
import com.schedule.dailyschedule.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getActivities(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) ActivityStatus status,
            @RequestParam(required = false) String category) {
        List<ActivityResponse> activities = activityService.getActivities(user, date, status, category);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/range")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByRange(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<ActivityResponse> activities = activityService.getActivitiesByDateRange(user, start, end);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> getActivityById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        ActivityResponse activity = activityService.getActivityById(user, id);
        return ResponseEntity.ok(activity);
    }

    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ActivityRequest request) {
        ActivityResponse created = activityService.createActivity(user, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request) {
        ActivityResponse updated = activityService.updateActivity(user, id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ActivityResponse> updateStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        ActivityResponse updated = activityService.updateStatus(user, id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        activityService.deleteActivity(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<DailySummaryResponse> getDailySummary(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DailySummaryResponse summary = activityService.getDailySummary(user, date);
        return ResponseEntity.ok(summary);
    }
}
