package com.exam.model.exam;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonProperty("qId")
    private Long qId;

    private String title;

    @Column(length = 5000)
    private String description;

    private String maxMarks;
    private String numberOfQuestions;
    private boolean active = false;

    // A Quiz belongs to ONE Category
    @ManyToOne(fetch = FetchType.EAGER)
    private Category category;
    @OneToMany(mappedBy = "quiz", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Question> questions = new HashSet<>();

    public Quiz() {
    }

    // Getters and Setters
    public Long getqId() { return qId; }
    public void setqId(Long qId) { this.qId = qId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMaxMarks() { return maxMarks; }
    public void setMaxMarks(String maxMarks) { this.maxMarks = maxMarks; }

    public String getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(String numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Set<Question> getQuestions() { return questions; }
    public void setQuestions(Set<Question> questions) { this.questions = questions; }
}
