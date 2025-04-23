package com.example.backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
   @Id
   @GeneratedValue
   @Column(name = "id", nullable = false, updatable = false)
   private UUID id;

   @Column(name = "login_id", unique = true, nullable = false)
   private String loginId;

   @Column(name = "password", nullable = false)
   private String password;

   @Column(name = "created_at")
   private Timestamp createdAt;

   @Column(name = "updated_at")
   private Timestamp updatedAt;

   @PreUpdate
   protected void onUpdate() {
       updatedAt = Timestamp.from(Instant.now());
   }
}
