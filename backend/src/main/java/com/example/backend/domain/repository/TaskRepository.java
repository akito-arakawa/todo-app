package com.example.backend.domain.repository;

import com.example.backend.domain.model.Status;
import com.example.backend.domain.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    //uerIdを基に全てのTaskを取得
    List<Task> findAllByUserId(UUID userId);

    //一つのタスクを取得
    Optional<Task> findByUserIdAndId(UUID userId, UUID id);

    //未完了・完了を取得
    List<Task> findByStatusAndUser_Id(Status status, UUID userId);

    //期限切れ(期限の記載のないものは表示しない)
    List<Task> findAllByUserIdAndDueDateIsNotNullAndDueDateBefore(UUID userId, Timestamp now);

    //近日締め切り(期限の記載のないものは表示しない)
    List<Task> findByUser_IdAndDueDateIsNotNullAndDueDateBetweenOrderByDueDate(
            UUID userId,
            Timestamp start,
            Timestamp end
    );

    //完了のみ削除
    void deleteByStatus(Status status);
}
