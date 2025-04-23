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

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {
    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    public void printAllTasks() {
        UUID userId = UUID.fromString("4246d3a7-879b-4d55-9dc7-24b6a3d60f88");
        UUID id = UUID.fromString("60eb1cf4-a990-4aa3-8569-558661547d39");
        Timestamp now = Timestamp.from(Instant.now());
        Timestamp sevenDaysLater = Timestamp.from(Instant.now().plusSeconds(7 * 24 * 60 * 60));
        List<Task> tasks = taskRepository.findByUser_IdAndDueDateIsNotNullAndDueDateBetweenOrderByDueDate(
                userId,
                now,
                sevenDaysLater
        );
        for (Task task : tasks) {
            System.out.println(task);
        }
    }

    //taskをすべて取得
    public List<Task> findAllBYTask(UUID userId) {
        return taskRepository.findAllByUserId(userId);
    }

    //一つのtaskを取得
    public Optional<Task> findByTask(UUID userId, UUID id) {
        return taskRepository.findByUserIdAndId(userId, id);
    }

    //完了・未完了を表示
    public List<Task> findByStatusTask(Status status, UUID userId) {
        return taskRepository.findByStatusAndUser_Id(status, userId);
    }

    //期限切れ
    public List<Task> findByDueDateBeforeTask(UUID userId) {
        //現在の時間を取得
        Timestamp now = Timestamp.from(Instant.now());
        return taskRepository.findAllByUserIdAndDueDateIsNotNullAndDueDateBefore(userId, now);
    }

    //近日締め切り(7日後まで)
    public List<Task> findTasksDueSoon(UUID userId) {
        //現在の時間を取得
        Timestamp now = Timestamp.from(Instant.now());
        //現在の時間から7日後を取得
        Timestamp sevenDaysLater = Timestamp.from(Instant.now().plusSeconds(7 * 24 * 60 * 60));
        return taskRepository.findByUser_IdAndDueDateIsNotNullAndDueDateBetweenOrderByDueDate(
                userId,
                now,
                sevenDaysLater
        );
    }

    //検証用(仮実装)追加処理
    @Transactional
    public Task addTask(TaskRequest request) {
        UUID userId = UUID.fromString("4246d3a7-879b-4d55-9dc7-24b6a3d60f88");
        Optional<User> user = userRepository.findById(userId);
        //userが存在する場合
        if (user.isPresent()) {
            //インスタンス生成
            Task task = new Task();
            task.setUser(user.get());
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setStatus(request.getStatus());
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("ユーザーが見つかりません");
        }
    }

    //指定されたIdのタスクを削除
    @Transactional
    public void deleteByTask(UUID taskId) {
        taskRepository.deleteById(taskId);
    }

    //完了のみを削除
    @Transactional
    public void deleteAllCompletedTasks(Status status) {
        taskRepository.deleteByStatus(status);
    }

    //編集処理(仮実装)
    @Transactional
    public Task updateTask(UUID userId, UUID taskId, TaskRequest request) {
        System.out.println("test");
        Optional<Task> existingTask = taskRepository.findByUserIdAndId(userId, taskId);
        //existingTaskが存在する場合値を上書き
        if (existingTask.isPresent()) {
            Task task = existingTask.get();
            System.out.println(task);
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setStatus(request.getStatus());
            return taskRepository.save(task);
        } else {
            throw new RuntimeException("タスクが見つかりません");
        }
    }

}
