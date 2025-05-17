package com.example.backend.app.controller;

import com.example.backend.domain.dto.TaskRequest;
import com.example.backend.domain.model.Status;
import com.example.backend.domain.model.Task;
import com.example.backend.domain.model.User;
import com.example.backend.domain.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    TaskService taskService;

    @GetMapping
    public ResponseEntity<?> findAllBYTask(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String loginId = userDetails.getUsername();
            List<Task> tasks = taskService.findAllByTask(loginId);
                return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }
    //完了表示
    @GetMapping("/complete")
    public ResponseEntity<?> findByCompleteTask(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String loginId = userDetails.getUsername();
            List<Task> tasks = taskService.findByStatusTask(Status.Complete, loginId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }
    //未完了表示
    @GetMapping("/inComplete")
    public ResponseEntity<?> findByInCompleteTask(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String loginId = userDetails.getUsername();
            List<Task> tasks = taskService.findByStatusTask(Status.InComplete, loginId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }
    //期限切れ表示
    @GetMapping("/expired")
    public ResponseEntity<?> findByExpiredTask(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String loginId = userDetails.getUsername();
            List<Task> tasks = taskService.findByDueDateBeforeTask(loginId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }
    //近日締め切り表示
    @GetMapping("/dueSoon")
    public ResponseEntity<?> findByDueSoonTask(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String loginId = userDetails.getUsername();
            List<Task> tasks = taskService.findTasksDueSoon(loginId);
            return ResponseEntity.ok(tasks);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> findByUserName(@AuthenticationPrincipal UserDetails userDetails) {
            String loginId = userDetails.getUsername();
            System.out.println(loginId);
            return ResponseEntity.ok(Map.of("loginId", loginId));
    }

    //追加処理
    @PostMapping
    public ResponseEntity<?> saveTasks(@RequestBody TaskRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String loginId = userDetails.getUsername();
            Task savedTask = taskService.addTask(request, loginId);
            return ResponseEntity.ok(savedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }

    //削除処理
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteByTask(id);
        return ResponseEntity.noContent().build();
    }

    //完了をすべて削除
    @DeleteMapping("/complete")
    public ResponseEntity<Void> deleteCompleteByTask(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("test");
        String loginId = userDetails.getUsername();
        taskService.deleteAllCompletedTasks(Status.Complete,loginId);
        return ResponseEntity.noContent().build();
    }

    //編集処理
    @PutMapping("/update/{taskId}")
    public ResponseEntity<?> updateTask(@AuthenticationPrincipal UserDetails userDetails,
                                        @PathVariable UUID taskId,
                                        @RequestBody TaskRequest request) {
        try {
            String loginId = userDetails.getUsername();
            Task exitingTask = taskService.updateTask(loginId, taskId, request);
            return ResponseEntity.ok(exitingTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }
}
