package com.exam.repository;

import com.exam.model.exam.Question;
import com.exam.model.exam.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Bypass object reflection and query the ID directly
    @Query("SELECT q FROM Question q WHERE q.quiz.qId = :quizId")
    Set<Question> findByQuizId(@Param("quizId") Long quizId);
}