package com.exam.controller;

import com.exam.config.JwtUtils;
import com.exam.model.JwtRequest;
import com.exam.model.JwtResponse;
import com.exam.model.User;
import com.exam.service.impl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin("*")
public class AuthenticateController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/generate-token")
    public ResponseEntity<?> generateToken(@RequestBody JwtRequest jwtRequest) throws Exception {

        System.out.println("Login attempt - Username: " + jwtRequest.getUsername());
        System.out.println("Login attempt - Password: " + jwtRequest.getPassword());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            jwtRequest.getUsername(),
                            jwtRequest.getPassword()
                    )
            );
        } catch (DisabledException e) {
            throw new Exception("USER DISABLED: " + e.getMessage());
        } catch (BadCredentialsException e) {
            System.out.println("BAD CREDENTIALS for user: " + jwtRequest.getUsername());
            throw new Exception("Invalid Credentials: " + e.getMessage());
        }

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(jwtRequest.getUsername());
        String token = this.jwtUtils.generateToken(userDetails);

        System.out.println("Token generated successfully for: " + jwtRequest.getUsername());

        return ResponseEntity.ok(new JwtResponse(token));
    }

    @GetMapping("/current-user")
    public User getCurrentUser(Principal principal) {
        return (User) this.userDetailsService.loadUserByUsername(principal.getName());
    }
}