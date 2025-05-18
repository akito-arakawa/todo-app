package com.example.backend.security;

import com.example.backend.domain.service.CustomUserDetailsService;
import com.example.backend.domain.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

   @Autowired
    JwtService jwtService;

    @Autowired
    CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        //requestからAuthorizationの値を取得
        final String authHeader = request.getHeader("Authorization");

        //リクエストヘッダーが空で、Bearer形式ではない場合
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        //jwtトークンのみを取得
        final String jwt = authHeader.substring(7);
        //トークンのloginIdを取得
        final String loginId = jwtService.extractUsername(jwt);
        // ユーザー名が存在し、まだ認証されていない場合
        if (loginId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            //loginIdを基にuserDetailsオブジェクトを作成
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginId);
            //有効期限をチェック
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );
                //認証済みユーザをセット
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        //次のフィルター・コントローラに情報を渡す
        filterChain.doFilter(request, response);
    }
}
