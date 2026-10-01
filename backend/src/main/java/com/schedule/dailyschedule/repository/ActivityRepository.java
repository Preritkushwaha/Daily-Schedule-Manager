package com.schedule.dailyschedule.repository;

import com.schedule.dailyschedule.model.Activity;
import com.schedule.dailyschedule.model.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByScheduleDateOrderByStartTimeAscOrderIndexAscCreatedAtAsc(LocalDate scheduleDate);

    List<Activity> findByScheduleDateAndStatusOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
            LocalDate scheduleDate, ActivityStatus status);

    List<Activity> findByScheduleDateAndCategoryIgnoreCaseOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
            LocalDate scheduleDate, String category);

    List<Activity> findByScheduleDateBetweenOrderByScheduleDateAscStartTimeAscOrderIndexAsc(
            LocalDate start, LocalDate end);

    long countByScheduleDate(LocalDate scheduleDate);

    long countByScheduleDateAndStatus(LocalDate scheduleDate, ActivityStatus status);
}
