package com.nr.synergysphere.auth.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

//here jwt service will do 2 things
//generate token for a particular email and extract email
//uses Jwts to generate the token and extract email
@Service
public class JwtService {
    //private String SECRET_KEY = "mysecretkeymysecretkeymysecretkey12";
    @Value("${jwt.secret}")
    private String SECRET_KEY;


    public String generateToken(String email){      //timing and date and signing algo
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ 1000*60*60*24))//1 day
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .compact(); //converts everything into a string
    }

    public String extractEmail(String token){//reads data form token
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseSignedClaims(token)//decodes jwt
                .getPayload()//body
                .getSubject();//reutrns email
    }

    //validity
    private Date expirationDate(String token){
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    public boolean isTokenExpired(String token){
        return expirationDate(token).before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


}
