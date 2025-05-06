package com.example.backend.app.controller;

import com.example.backend.domain.dto.TaskRequest;
import com.example.backend.domain.model.Status;
import com.example.backend.domain.model.Task;
import com.example.backend.domain.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    TaskService taskService;

    //仮のID
    UUID userId = UUID.fromString("4246d3a7-879b-4d55-9dc7-24b6a3d60f88");

    @GetMapping
    public ResponseEntity<?> findAllBYTask() {
        try {
            List<Task> tasks = taskService.findAllBYTask(userId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage()); //エラー内容表示
        }
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<?> findByTask(@PathVariable UUID taskId) {
        try {
            Optional<Task> task = taskService.findByTask(userId, taskId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage()); //エラー内容表示
        }
    }

    @GetMapping("/complete")
    public ResponseEntity<?> findByCompleteTask() {
        try {
            List<Task> tasks = taskService.findByStatusTask(Status.Complete, userId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/inComplete")
    public ResponseEntity<?> findByInCompleteTask() {
        try {
            List<Task> tasks = taskService.findByStatusTask(Status.InComplete, userId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/expired")
    public ResponseEntity<?> findByExpiredTask() {
        try {
            List<Task> tasks = taskService.findByDueDateBeforeTask(userId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/dueSoon")
    public ResponseEntity<?> findByDueSoonTask() {
        try {
            List<Task> tasks = taskService.findTasksDueSoon(userId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    //検証save
    @PostMapping
    public ResponseEntity<?> saveTasks(@RequestBody TaskRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String loginId = userDetails.getUsername();
            Task savedTask = taskService.addTask(request, loginId);
            return ResponseEntity.ok(savedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage()); //エラー内容表示
        }
    }

    //検証用delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskService.deleteByTask(id);
        return ResponseEntity.noContent().build();
    }

    //検証用delete
    @DeleteMapping("/complete")
    public ResponseEntity<Void> deleteCompleteByTask() {
        taskService.deleteAllCompletedTasks(Status.Complete);
        return ResponseEntity.noContent().build();
    }

    //検証用Update
    @PutMapping("/update/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable UUID userId,
                                        @PathVariable UUID taskId,
                                        @RequestBody TaskRequest request) {
        try {
            Task exitingTask = taskService.updateTask(userId, taskId, request);
            return ResponseEntity.ok(exitingTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
