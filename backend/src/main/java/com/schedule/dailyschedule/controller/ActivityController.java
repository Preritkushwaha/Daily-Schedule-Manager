package com.schedule.dailyschedule.controller;

import com.schedule.dailyschedule.dto.ActivityRequest;
import com.schedule.dailyschedule.dto.ActivityResponse;
import com.schedule.dailyschedule.dto.DailySummaryResponse;
import com.schedule.dailyschedule.dto.StatusUpdateRequest;
import com.schedule.dailyschedule.model.ActivityStatus;
import com.schedule.dailyschedule.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) ActivityStatus status,
            @RequestParam(required = false) String category) {
        List<ActivityResponse> activities = activityService.getActivities(date, status, category);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/range")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<ActivityResponse> activities = activityService.getActivitiesByDateRange(start, end);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> getActivityById(@PathVariable Long id) {
        ActivityResponse activity = activityService.getActivityById(id);
        return ResponseEntity.ok(activity);
    }

    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody ActivityRequest request) {
        ActivityResponse created = activityService.createActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request) {
        ActivityResponse updated = activityService.updateActivity(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ActivityResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        ActivityResponse updated = activityService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<DailySummaryResponse> getDailySummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DailySummaryResponse summary = activityService.getDailySummary(date);
        return ResponseEntity.ok(summary);
    }
}
