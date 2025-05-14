package com.example.backend.app.controller;

import com.example.backend.domain.dto.LoginRequest;
import com.example.backend.domain.model.RefreshToken;
import com.example.backend.domain.model.User;
import com.example.backend.domain.repository.RefreshTokenRepository;
import com.example.backend.domain.repository.UserRepository;
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

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtService jwtService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RefreshTokenRepository refreshTokenRepository;

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
            //アクセストークンを発行
            String accessToken  = jwtService.generateAccessToken(userDetails);
            //リフレッシュトークンを発行
            String refreshTokenStr = jwtService.generateRefreshToken(userDetails);

            RefreshToken refreshToken = new RefreshToken();
            Optional<User> user = userRepository.findByLoginId(userDetails.getUsername());
            if (user.isPresent()) {
                refreshToken.setUser(user.orElseThrow());
                refreshToken.setToken(refreshTokenStr);
                refreshToken.setExpiryDate(new Timestamp(System.currentTimeMillis() + 1000L * 60 * 60 * 24));
            } else {
                throw new RuntimeException();
            }

            refreshTokenRepository.save(refreshToken);

            return ResponseEntity.ok(Map.of("accessToken", accessToken,
                                            "refreshToken",refreshTokenStr
                    ));
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

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        String refreshTokenStr = request.get("refreshToken");

        Optional<RefreshToken> optionalRefreshToken = refreshTokenRepository.findByToken(refreshTokenStr);
        //値が空の場合
        if(optionalRefreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("無効なリフレッシュトークン");
        }
        //値を取得
        RefreshToken refreshToken = optionalRefreshToken.get();

        //有効期限をチェック
        if (refreshToken.getExpiryDate().before(new Timestamp(System.currentTimeMillis()))) {
            //期限切れトークンを削除
            refreshTokenRepository.delete(refreshToken);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("リフレッシュトークンが期限切れ");
        }

        //アクセストークンを再発行
        User user = refreshToken.getUser();
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getLoginId(),
                user.getPassword(),
                new ArrayList<>()
        );

        //新しいトークンを作成
        String newAccessToken = jwtService.generateAccessToken(userDetails);

        //新しいアクセストークンを返す
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }
}
