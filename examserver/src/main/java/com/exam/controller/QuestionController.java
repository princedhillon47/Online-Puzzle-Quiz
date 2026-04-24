package com.exam.controller;

import com.exam.model.exam.Question;
import com.exam.model.exam.Quiz;
import com.exam.service.QuestionService;
import com.exam.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuizService quizService;

    // 1. Add a new question
    // This tells Spring Boot to accept BOTH "/question" and "/question/"
    @PostMapping({"/", ""})
    public ResponseEntity<Question> add(@RequestBody Question question) {
        // ... your existing code ...
        return ResponseEntity.ok(this.questionService.addQuestion(question));
    }

    // 2. Update an existing question
    @PutMapping("/")
    public ResponseEntity<Question> update(@RequestBody Question question) {
        return ResponseEntity.ok(this.questionService.updateQuestion(question));
    }

    // 3. Get a normal user's questions for a quiz (Randomized and limited by max questions)
    @GetMapping("/quiz/{qid}")
    public ResponseEntity<?> getQuestionsOfQuiz(@PathVariable("qid") Long qid) {
        Quiz quiz = this.quizService.getQuiz(qid);
        Set<Question> questions = quiz.getQuestions();
        List<Question> list = new ArrayList<>(questions);

        // Limit the number of questions to the quiz's defined maximum
        if (list.size() > Integer.parseInt(quiz.getNumberOfQuestions())) {
            list = list.subList(0, Integer.parseInt(quiz.getNumberOfQuestions() + 1));
        }

        // Shuffle the questions so they appear in a different order for each user
        Collections.shuffle(list);
        return ResponseEntity.ok(list);
    }

    // 4. Get all questions of a quiz for the Admin panel
    @GetMapping("/quiz/all/{qid}")
    public ResponseEntity<?> getQuestionsOfQuizAdmin(@PathVariable("qid") Long qid) {
        // Fetch the REAL quiz completely from the database first to avoid Hibernate errors
        Quiz quiz = this.quizService.getQuiz(qid);
        Set<Question> questionsOfQuiz = this.questionService.getQuestionsOfQuiz(quiz);
        return ResponseEntity.ok(questionsOfQuiz);
    }

    // 5. Get a single question by its ID
    @GetMapping("/{quesId}")
    public Question get(@PathVariable("quesId") Long quesId) {
        return this.questionService.getQuestion(quesId);
    }

    // 6. Delete a question
    @DeleteMapping("/{quesId}")
    public void delete(@PathVariable("quesId") Long quesId) {
        this.questionService.deleteQuestion(quesId);
    }

    // 7. Securely evaluate the quiz on the backend
    @PostMapping("/eval-quiz")
    public ResponseEntity<?> evalQuiz(@RequestBody List<Question> questions) {
        System.out.println("Evaluating Quiz securely on the backend...");

        double marksGot = 0;
        int correctAnswers = 0;
        int attempted = 0;

        for (Question q : questions) {
            // Fetch the real question from the database to check the true answer
            Question question = this.questionService.getQuestion(q.getQuesId());

            // Compare the user's given answer with the real answer
            if (question.getAnswer().equals(q.getGivenAnswer())) {
                correctAnswers++;

                // Calculate marks for this single question
                double marksSingle = Double.parseDouble(questions.get(0).getQuiz().getMaxMarks()) / questions.size();
                marksGot += marksSingle;
            }

            // Count how many questions were actually attempted
            if (q.getGivenAnswer() != null && !q.getGivenAnswer().trim().equals("")) {
                attempted++;
            }
        }

        // Package the results into a Map to send back to Angular
        Map<String, Object> map = Map.of(
                "marksGot", marksGot,
                "correctAnswers", correctAnswers,
                "attempted", attempted
        );

        return ResponseEntity.ok(map);
    }
}