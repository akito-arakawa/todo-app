package com.example.backend.domain.service;

import com.example.backend.domain.model.User;
import com.example.backend.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    //ログイン処理時に呼び出す
    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        //loginIdからuserを取得
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("ユーザが見つかりません"));
        //UserDetailsのインスタンスを生成
        return org.springframework.security.core.userdetails.User
                //loginIdをセット
                .withUsername(user.getLoginId())
                //passwordをセット
                .password(user.getPassword())
                .authorities(Collections.emptyList()) // 権限なし
                .build();
    }
}
