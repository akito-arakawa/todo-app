package com.example.backend.app.controller;

import com.example.backend.domain.dto.LoginRequest;
import com.example.backend.domain.model.User;
import com.example.backend.domain.service.JwtService;
import com.example.backend.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            //ログイン認証処理
            System.out.println(request);
            Authentication authentication = authManager.authenticate(
                    //ログイン情報をセット
                    new UsernamePasswordAuthenticationToken(
                            request.getLoginId(),
                            request.getPassword()
                    )
            );
            //ログイン済みユーザの情報を取り出す
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            //ユーザの情報を基にトークンを発行
            String token = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ログイン失敗：ユーザーが見つかりません");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("ログイン失敗：IDまたはパスワードが間違っています");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> RegistrationUser(@RequestBody LoginRequest request) {
        if (userService.existsByLoginId(request.getLoginId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("既に存在するユーザー名です");
        }
        try {
            User user = userService.addUser(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("登録中にエラーが発生しました"); //エラー内容表示
        }
    }
}
