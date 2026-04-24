import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/admin/dashboard/dashboard';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard';
import { WelcomeComponent } from './pages/admin/welcome/welcome'; // Import Welcome
import { adminGuard } from './services/admin.guard';
import { normalGuard } from './services/normal.guard';
import { AddCategoryComponent } from './pages/admin/add-category/add-category'; // Import it here
import { ViewCategoriesComponent } from './pages/admin/view-categories/view-categories';
import { ViewQuizzesComponent } from './pages/admin/view-quizzes/view-quizzes';
import { AddQuizComponent } from './pages/admin/add-quiz/add-quiz';
import { ViewQuizQuestionsComponent } from './pages/admin/view-quiz-questions/view-quiz-questions';
import { AddQuestionComponent } from './pages/admin/add-question/add-question';
import { LoadQuizComponent } from './pages/user/load-quiz/load-quiz';
import { InstructionsComponent } from './pages/user/instructions/instructions';
import { StartComponent } from './pages/user/start/start';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [adminGuard],
    runGuardsAndResolvers: 'always', // 👈 ADD THIS
    // Add nested routes here
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'add-category',
        component: AddCategoryComponent,
      },
      {
        path: 'categories',
        component: ViewCategoriesComponent,
      },
      { path: 'quizzes', component: ViewQuizzesComponent },
      { path: 'add-quiz', component: AddQuizComponent },
      { path: 'view-questions/:qid/:title', component: ViewQuizQuestionsComponent },
      { path: 'add-question/:qid/:title', component: AddQuestionComponent },
    ],
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,

    children: [
      // The :catId parameter lets us load "All" (0) or a specific category
      { path: 'profile', component: ProfileComponent },

      { path: 'instructions/:qid', component: InstructionsComponent },
      { path: ':catId', component: LoadQuizComponent },
    ],
  },
  { path: 'start/:qid', component: StartComponent },
  {
    path: '**',
    redirectTo: 'login',
  },
];
