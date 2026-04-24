import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  getQuiz(qId: any) {
    return this.http.get(`${this.baseUrl}/quiz/${qId}`);
  }
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Load all quizzes
  public quizzes() {
    return this.http.get(`${this.baseUrl}/quiz`);
  }

  // Add a new quiz
  public addQuiz(quiz: any) {
    return this.http.post(`${this.baseUrl}/quiz`, quiz);
  }
  // Delete a quiz
  public deleteQuiz(qid: any) {
    return this.http.delete(`${this.baseUrl}/quiz/${qid}`);
  }
}
