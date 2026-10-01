package com.schedule.dailyschedule.repository;

import com.schedule.dailyschedule.model.Activity;
import com.schedule.dailyschedule.model.ActivityStatus;
import com.schedule.dailyschedule.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByUserAndScheduleDateOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
            User user, LocalDate scheduleDate);

    List<Activity> findByUserAndScheduleDateAndStatusOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
            User user, LocalDate scheduleDate, ActivityStatus status);

    List<Activity> findByUserAndScheduleDateAndCategoryIgnoreCaseOrderByStartTimeAscOrderIndexAscCreatedAtAsc(
            User user, LocalDate scheduleDate, String category);

    List<Activity> findByUserAndScheduleDateBetweenOrderByScheduleDateAscStartTimeAscOrderIndexAsc(
            User user, LocalDate start, LocalDate end);

    long countByUserAndScheduleDate(User user, LocalDate scheduleDate);

    long countByUserAndScheduleDateAndStatus(User user, LocalDate scheduleDate, ActivityStatus status);

    Optional<Activity> findByIdAndUser(Long id, User user);

    boolean existsByIdAndUser(Long id, User user);

    void deleteByIdAndUser(Long id, User user);
}
