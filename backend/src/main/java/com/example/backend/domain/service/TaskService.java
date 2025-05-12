package com.example.backend.domain.service;

import com.example.backend.domain.dto.TaskRequest;
import com.example.backend.domain.model.Status;
import com.example.backend.domain.model.Task;
import com.example.backend.domain.model.User;
import com.example.backend.domain.repository.TaskRepository;
import com.example.backend.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {
    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    //taskをすべて取得
    public List<Task> findAllByTask(String loginId) {
        Optional<User> user = userRepository.findByLoginId(loginId);
        if (user.isPresent()) {
            UUID userId = user.get().getId();
            return taskRepository.findAllByUserIdOrderByCreatedAtAsc(userId);
        } else {
            throw new RuntimeException("問題が発生しました");
        }
    }

    //一つのtaskを取得
    public Optional<Task> findByTask(UUID userId, UUID id) {
        return taskRepository.findByUserIdAndId(userId, id);
    }

    //完了・未完了を表示
    public List<Task> findByStatusTask(Status status, String loginId) {
        Optional<User> user = userRepository.findByLoginId(loginId);
        if (user.isPresent()) {
            UUID userId = user.get().getId();
            return taskRepository.findByStatusAndUser_IdOrderByCreatedAtAsc(status, userId);
        } else {
            throw new RuntimeException("問題が発生しました");
        }
    }

    //期限切れ
    public List<Task> findByDueDateBeforeTask(String loginId) {
        Optional<User> user = userRepository.findByLoginId(loginId);
        if (user.isPresent()) {
            UUID userId = user.get().getId();
            //今日の日付の0:00を取得
            LocalDate today = LocalDate.now();
            Timestamp todayStart = Timestamp.valueOf(today.atStartOfDay());
            return taskRepository.findAllByUserIdAndDueDateIsNotNullAndDueDateBeforeOrderByDueDateAsc(userId, todayStart);
        } else {
            throw new RuntimeException("問題が発生しました");
        }
    }

    //近日締め切り(7日後まで)
    public List<Task> findTasksDueSoon(String loginId) {
        Optional<User> user = userRepository.findByLoginId(loginId);
        if (user.isPresent()) {
            UUID userId = user.get().getId();
            //今日の日付の0:00を取得
            LocalDate today = LocalDate.now();
            Timestamp todayStart = Timestamp.valueOf(today.atStartOfDay());
            //現在の時間から7日後を取得
            Timestamp sevenDaysLater = Timestamp.from(Instant.now().plusSeconds(7 * 24 * 60 * 60));
            return taskRepository.findByUser_IdAndDueDateIsNotNullAndDueDateBetweenOrderByDueDate(
                    userId,
                    todayStart,
                    sevenDaysLater
            );
        } else {
            throw new RuntimeException("問題が発生しました");
        }
    }

    //追加処理
    @Transactional
    public Task addTask(TaskRequest request, String loginId) {
        System.out.println("test");
        Optional<User> user = userRepository.findByLoginId(loginId);
        //userが存在する場合
        if (user.isPresent()) {
            //インスタンス生成
            Task task = new Task();
            task.setUser(user.get());
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setStatus(Status.InComplete);
            task.setDueDate(request.getDueDate());
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("ユーザーが見つかりません");
        }
    }

    //指定されたIdのタスクを削除
    @Transactional
    public void deleteByTask(String taskId) {
        UUID taskUUID = UUID.fromString(taskId);
        taskRepository.deleteById(taskUUID);
    }

    //完了のみを削除
    @Transactional
    public void deleteAllCompletedTasks(Status status, String loginId) {
        Optional<User> user = userRepository.findByLoginId(loginId);
        if(user.isPresent()) {
            UUID userId = user.get().getId();
            taskRepository.deleteByUserIdAndStatus(userId,status);
        }

    }

    //編集処理
    @Transactional
    public Task updateTask(String loginId, UUID taskId, TaskRequest request) {
        System.out.println("test");
        Optional<User> user = userRepository.findByLoginId(loginId);
        if (user.isPresent()) {
            UUID userId = user.get().getId();
            Optional<Task> existingTask = taskRepository.findByUserIdAndId(userId, taskId);
            //existingTaskが存在する場合値を上書き
            if (existingTask.isPresent()) {
                Task task = existingTask.get();
                System.out.println(task);
                task.setTitle(request.getTitle());
                task.setDescription(request.getDescription());
                task.setStatus(request.getStatus());
                task.setDueDate(request.getDueDate());
                return taskRepository.save(task);
            } else {
                throw new RuntimeException("タスクが見つかりません");
            }
        } else {
            throw new RuntimeException("userが見つかりません");
        }

    }

}
