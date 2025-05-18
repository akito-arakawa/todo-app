package com.example.backend.domain.service;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {


    private static final Dotenv dotenv = Dotenv.load();
    private static final String SECRET = dotenv.get("JWT_SECRET");
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // アクセストークン有効期限：1時間（ミリ秒）
    private static final long ACCESS_TIME =  60 * 60 * 24;
    //リフレッシュトークン有効期限: 7日(ミリ秒)
    private  static  final long REFRESH_TIME = 1000L * 60 * 60 * 24 * 7;

    // アクセストークン発行
    public String generateAccessToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) //トークンが誰のモノか
                .setIssuedAt(new Date()) // 発行時間
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TIME)) // 有効期限
                .signWith(SECRET_KEY) // 署名
                .compact(); //JWTを構築
    }
    //リフレッシュトークン発行
    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) //トークンが誰のモノか
                .setIssuedAt(new Date()) // 発行時間
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TIME)) // 有効期限
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
