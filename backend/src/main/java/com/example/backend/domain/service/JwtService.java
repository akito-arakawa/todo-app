package com.example.backend.domain.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    //秘密鍵（仮ローカル用）
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 有効期限：24時間（ミリ秒）
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    // JWT発行
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) //トークンが誰のモノか
                .setIssuedAt(new Date()) // 発行時間
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 有効期限
                .signWith(SECRET_KEY) // 署名
                .compact(); //JWTを構築
    }

    // トークンからログインID（=subject）を取り出す
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // トークンの有効性を確認
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // 有効期限切れか確認
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // JWTの全claim（中身）を取り出す
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
