package com.example.backend.domain.dto;

import com.example.backend.domain.model.Status;
import lombok.Data;

import java.sql.Time;
import java.sql.Timestamp;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Status status;
    private Timestamp dueDate;
}
