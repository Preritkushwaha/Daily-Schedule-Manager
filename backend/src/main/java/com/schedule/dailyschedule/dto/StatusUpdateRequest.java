package com.schedule.dailyschedule.dto;

import com.schedule.dailyschedule.model.ActivityStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Status cannot be null")
    private ActivityStatus status;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(ActivityStatus status) {
        this.status = status;
    }

    public ActivityStatus getStatus() {
        return status;
    }

    public void setStatus(ActivityStatus status) {
        this.status = status;
    }
}
