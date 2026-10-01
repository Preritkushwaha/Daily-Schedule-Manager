package com.schedule.dailyschedule.dto;

import java.time.LocalDate;

public class DailySummaryResponse {

    private LocalDate date;
    private long totalActivities;
    private long completedActivities;
    private long ongoingActivities;
    private long notStartedActivities;
    private int completionPercentage;

    public DailySummaryResponse() {
    }

    public DailySummaryResponse(LocalDate date, long totalActivities, long completedActivities,
                                long ongoingActivities, long notStartedActivities) {
        this.date = date;
        this.totalActivities = totalActivities;
        this.completedActivities = completedActivities;
        this.ongoingActivities = ongoingActivities;
        this.notStartedActivities = notStartedActivities;
        this.completionPercentage = totalActivities > 0 ? (int) Math.round((completedActivities * 100.0) / totalActivities) : 0;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public long getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(long completedActivities) {
        this.completedActivities = completedActivities;
    }

    public long getOngoingActivities() {
        return ongoingActivities;
    }

    public void setOngoingActivities(long ongoingActivities) {
        this.ongoingActivities = ongoingActivities;
    }

    public long getNotStartedActivities() {
        return notStartedActivities;
    }

    public void setNotStartedActivities(long notStartedActivities) {
        this.notStartedActivities = notStartedActivities;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
