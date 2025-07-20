// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { DatePipe } from '@angular/common';
// import { of } from 'rxjs';
// import { BlogDetailComponent } from './blog-detail.component';
// import { ApiService } from '../../core/services/api.service';
// import { Article } from '../../shared/models/article.model';
// import { Comment } from '../../shared/models/comment.model';

// describe('BlogDetailComponent', () => {
//   let component: BlogDetailComponent;
//   let fixture: ComponentFixture<BlogDetailComponent>;
//   let apiService: ApiService;

//   const mockArticle: Article = {
//     id: 1,
//     title: 'Sample Article',
//     content: 'Content here',
//     // image_url: null,
//     published_at: '2025-05-21T09:00:00.000Z',
//     status: 'published',
//     created_at: '2025-05-21T09:00:00.000Z',
//     updated_at: '2025-05-21T09:00:00.000Z',
//     author: { username: 'user1' },
//     comment_count: 1
//   };

//   const mockComments: Comment[] = [
//     {
//       id: 1,
//       content: 'Test comment',
//       created_at: '2025-05-21T09:00:00.000Z',
//       user: { username: 'user1' }
//     }
//   ];

//   beforeEach(async () => {
//     const activatedRouteStub = {
//       snapshot: {
//         paramMap: {
//           get: () => '1' // Mock article ID
//         }
//       }
//     };

//     await TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         DatePipe,
//         BlogDetailComponent // Standalone component
//       ],
//       providers: [
//         { provide: ActivatedRoute, useValue: activatedRouteStub },
//         ApiService
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(BlogDetailComponent);
//     component = fixture.componentInstance;
//     apiService = TestBed.inject(ApiService);

//     // Mock API calls
//     spyOn(apiService, 'getArticleById').and.returnValue(of(mockArticle));
//     spyOn(apiService, 'getCommentsByArticleId').and.returnValue(of(mockComments));

//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load article and comments on init', () => {
//     expect(apiService.getArticleById).toHaveBeenCalledWith(1);
//     expect(apiService.getCommentsByArticleId).toHaveBeenCalledWith(1);
//     expect(component.article()).toEqual(mockArticle);
//     expect(component.comments()).toEqual(mockComments);
//     expect(component.loadingComments()).toBeFalse();
//   });

//   it('should display error message if no articleId', () => {
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     activatedRouteStub.snapshot.paramMap.get = () => null;
//     component.ngOnInit();
//     expect(component.errorMessage()).toBe('Không tìm thấy bài viết.');
//   });
// });