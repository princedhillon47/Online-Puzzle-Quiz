package com.exam;

import com.exam.model.Role;
import com.exam.model.User;
import com.exam.model.UserRole;
import com.exam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class ExamserverApplication implements CommandLineRunner {

    @Autowired
    private UserService userService;

    public static void main(String[] args) {
        SpringApplication.run(ExamserverApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting application...");

        try {
            // Check if admin already exists to avoid errors on restart
            if (this.userService.getUser("admin123") == null) {

                User user = new User();
                user.setFirstName("Princepreet"); // You can put your name here!
                user.setLastName("Admin");
                user.setUsername("admin123");
                user.setPassword("admin123");
                user.setEmail("admin@examportal.com");
                user.setProfile("default.png");

                Role role1 = new Role();
                role1.setRoleId(44L);
                role1.setRoleName("ADMIN");

                Set<UserRole> userRoleSet = new HashSet<>();
                UserRole userRole = new UserRole();
                userRole.setRole(role1);
                userRole.setUser(user);
                userRoleSet.add(userRole);

                User savedUser = this.userService.createUser(user, userRoleSet);
                System.out.println("Admin user created with username: " + savedUser.getUsername());
            } else {
                System.out.println("Admin user already exists!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}