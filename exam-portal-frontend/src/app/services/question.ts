import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Get questions for a specific quiz
  public getQuestionsOfQuiz(qid: any) {
    return this.http.get(`${this.baseUrl}/question/quiz/all/${qid}`);
  }

  // Add a new question
  public addQuestion(question: any) {
    return this.http.post(`${this.baseUrl}/question`, question);
  }
  public deleteQuestion(questionId: any) {
    return this.http.delete(`${this.baseUrl}/question/${questionId}`);
  }
  public evalQuiz(questions: any) {
    return this.http.post(`${this.baseUrl}/question/eval-quiz`, questions);
  }
}
