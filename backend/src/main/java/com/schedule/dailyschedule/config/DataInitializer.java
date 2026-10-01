package com.schedule.dailyschedule.config;

import com.schedule.dailyschedule.model.Activity;
import com.schedule.dailyschedule.model.ActivityPriority;
import com.schedule.dailyschedule.model.ActivityStatus;
import com.schedule.dailyschedule.repository.ActivityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(ActivityRepository repository) {
        return args -> {
            LocalDate today = LocalDate.now();
            if (repository.countByScheduleDate(today) == 0) {
                List<Activity> sampleActivities = List.of(
                        new Activity(
                                "Morning Stretch & Hydration",
                                "Drink 500ml water and 15 mins mobility stretches.",
                                today,
                                LocalTime.of(7, 30),
                                LocalTime.of(8, 0),
                                ActivityStatus.COMPLETED,
                                ActivityPriority.MEDIUM,
                                "Health",
                                1
                        ),
                        new Activity(
                                "Daily Standup & Task Planning",
                                "Review today's priorities and align with team goals.",
                                today,
                                LocalTime.of(9, 0),
                                LocalTime.of(9, 30),
                                ActivityStatus.COMPLETED,
                                ActivityPriority.HIGH,
                                "Work",
                                2
                        ),
                        new Activity(
                                "Deep Work: Build REST API & Dashboard",
                                "Focus block: build backend services and clean Notion-inspired UI.",
                                today,
                                LocalTime.of(10, 0),
                                LocalTime.of(12, 30),
                                ActivityStatus.ONGOING,
                                ActivityPriority.HIGH,
                                "Work",
                                3
                        ),
                        new Activity(
                                "Healthy Lunch & Fresh Air Walk",
                                "Nutritious meal and a 20-minute walk outside.",
                                today,
                                LocalTime.of(13, 0),
                                LocalTime.of(14, 0),
                                ActivityStatus.NOT_STARTED,
                                ActivityPriority.LOW,
                                "Health",
                                4
                        ),
                        new Activity(
                                "Code Review & PR Feedback",
                                "Review open pull requests and discuss architecture improvements.",
                                today,
                                LocalTime.of(14, 30),
                                LocalTime.of(16, 0),
                                ActivityStatus.NOT_STARTED,
                                ActivityPriority.MEDIUM,
                                "Work",
                                5
                        ),
                        new Activity(
                                "Study: Distributed Systems Reading",
                                "Read 1 chapter on consensus algorithms and take notes.",
                                today,
                                LocalTime.of(17, 0),
                                LocalTime.of(18, 0),
                                ActivityStatus.NOT_STARTED,
                                ActivityPriority.LOW,
                                "Study",
                                6
                        )
                );
                repository.saveAll(sampleActivities);
            }
        };
    }
}
