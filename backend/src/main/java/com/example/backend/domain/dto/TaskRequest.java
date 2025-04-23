package com.example.backend.domain.dto;

import com.example.backend.domain.model.Status;
import lombok.Data;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Status status;
}
