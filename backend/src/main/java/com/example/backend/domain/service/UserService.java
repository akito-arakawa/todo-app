package com.example.backend.domain.service;

import com.example.backend.domain.dto.LoginRequest;
import com.example.backend.domain.model.User;
import com.example.backend.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Transactional
    public User addUser(LoginRequest request) {
        System.out.println(request);
        try {
            //userインスタンス作成・値をセット
            User user = new User();
            user.setLoginId(request.getLoginId());
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            user.setPassword(encodedPassword);
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("ユーザー登録に失敗しました", e);
        }
    }
    //loginIdチェック処理
    public boolean existsByLoginId(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }
}
