import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Article, CreateArticleDto, UpdateArticleDto } from '../../shared/models/article.model';
import { DashboardStats } from '../../shared/models/dashboard.model';
import { Category } from '../../shared/models/category.model';
import { User, CreateUserDto, UpdateUserDto } from '../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';

interface ValidationErrors {
  title?: string;
  content?: string;
  categoryId?: string;
  image_url?: string;
  status?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = { totalUsers: 0, totalArticles: 0 };
  articles: Article[] = [];
  users: User[] = [];
  categories: Category[] = [];
  errors: ValidationErrors = {};

  newArticle: CreateArticleDto = {
    title: '',
    content: '',
    image_url: '',
    status: 'draft',
    categoryId: 0,
  };

  newUser: CreateUserDto & { confirmPassword: string } = {
    username: '',
    email: '',
    password: '',
    role: 'user',
    confirmPassword: '',
  };

  editingArticle: Article | null = null;
  editingUser: User | null = null;
  activeTab: 'articles' | 'users' = 'articles';
  loading = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    if (!this.authService.isAdmin()) {
      this.toastr.error('Bạn không có quyền truy cập trang này.', 'Lỗi truy cập');
      this.router.navigate(['/']);
      return;
    }
    this.loadAllData();
  }

  private loadAllData(): void {
    this.loading = true;
    Promise.all([
      this.loadStats(),
      this.loadArticles(),
      this.loadCategories(),
      this.loadUsers(),
    ]).finally(() => {
      this.loading = false;
    });
  }

  loadStats(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getDashboardStats().subscribe({
        next: (stats) => {
          this.stats = stats;
          resolve();
        },
        error: (error) => {
          console.error('Error loading stats:', error);
          this.toastr.error('Không thể tải thống kê', 'Lỗi');
          resolve();
        },
      });
    });
  }

  loadArticles(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getAdminArticles().subscribe({
        next: (articles) => {
          console.log('Loaded articles:', articles.map(a => ({ id: a.id, categoryId: a.categoryId, categoryIdType: typeof a.categoryId })));
          this.articles = articles.sort((a, b) => b.id - a.id);
          resolve();
        },
        error: (error) => {
          console.error('Error loading articles:', error);
          this.toastr.error('Không thể tải danh sách bài viết', 'Lỗi');
          resolve();
        },
      });
    });
  }

  loadCategories(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getCategories().subscribe({
        next: (categories) => {
          console.log('Loaded categories:', categories.map(cat => ({ id: cat.id, name: cat.name, idType: typeof cat.id })));
          this.categories = categories;
          // Không gán newArticle.categoryId ở đây để tránh ghi đè giá trị đã chọn
          if (categories.length === 0) {
            this.toastr.warning('Không có danh mục nào. Vui lòng tạo danh mục trước.', 'Cảnh báo');
          }
          resolve();
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.toastr.error('Không thể tải danh mục', 'Lỗi');
          resolve();
        },
      });
    });
  }

  loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getAdminUsers().subscribe({
        next: (users) => {
          this.users = users.sort((a, b) => b.id - a.id);
          resolve();
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.toastr.error('Không thể tải danh sách người dùng', 'Lỗi');
          resolve();
        },
      });
    });
  }

  switchTab(tab: 'articles' | 'users'): void {
    this.activeTab = tab;
    this.cancelEditArticle();
    this.cancelEditUser();
  }

  // Article Management
  createArticle(): void {
    if (this.categories.length === 0) {
      this.toastr.error('Danh mục chưa được tải. Vui lòng thử lại sau.', 'Lỗi');
      console.log('Categories not loaded yet');
      return;
    }
    if (!this.validateArticleForm()) return;

    this.apiService.createArticle(this.newArticle).subscribe({
      next: () => {
        this.loadArticles();
        this.resetArticleForm();
        this.toastr.success('Bài viết đã được tạo thành công!', 'Thành công');
        this.loadStats();
      },
      error: (error) => {
        console.error('Error creating article:', error);
        this.toastr.error('Không thể tạo bài viết. Vui lòng thử lại.', 'Lỗi');
      },
    });
  }

  editArticle(): void {
    if (!this.editingArticle || !this.validateArticleForm()) return;

    const updateDto: UpdateArticleDto = {
      title: this.newArticle.title,
      content: this.newArticle.content,
      image_url: this.newArticle.image_url || undefined,
      status: this.newArticle.status,
      categoryId: this.newArticle.categoryId,
    };

    this.apiService.updateArticle(this.editingArticle.id, updateDto).subscribe({
      next: () => {
        this.loadArticles();
        this.cancelEditArticle();
        this.toastr.success('Bài viết đã được cập nhật thành công!', 'Thành công');
      },
      error: (error) => {
        console.error('Error updating article:', error);
        this.toastr.error('Không thể cập nhật bài viết. Vui lòng thử lại.', 'Lỗi');
      },
    });
  }

  startEditArticle(article: Article): void {
    console.log('Editing article:', { id: article.id, categoryId: article.categoryId, categoryIdType: typeof article.categoryId });
    console.log('Categories:', this.categories.map(cat => ({ id: cat.id, name: cat.name, idType: typeof cat.id })));
    console.log('Setting newArticle.categoryId:', article.categoryId);

    if (this.categories.length === 0) {
      this.toastr.error('Danh mục chưa được tải. Vui lòng thử lại sau.', 'Lỗi');
      console.log('Categories not loaded yet');
      return;
    }

    this.editingArticle = { ...article };
    this.newArticle = {
      title: article.title,
      content: article.content,
      image_url: article.image_url || '',
      status: article.status,
      categoryId: Number(article.categoryId), // Ép kiểu để đảm bảo là number
    };

    // Kiểm tra categoryId có hợp lệ không
    if (!this.categories.some(cat => cat.id === this.newArticle.categoryId)) {
      console.warn(`Invalid categoryId: ${this.newArticle.categoryId}. Using default category.`);
      this.newArticle.categoryId = this.categories[0].id;
      this.toastr.warning('Danh mục bài viết không hợp lệ. Đã chọn danh mục mặc định.', 'Cảnh báo');
    }

    console.log('newArticle after set:', this.newArticle);
    this.cdr.detectChanges();
    this.scrollToTop();
  }

  cancelEditArticle(): void {
    this.editingArticle = null;
    this.resetArticleForm();
    this.errors = {};
  }

  deleteArticle(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.')) {
      return;
    }

    this.apiService.deleteArticle(id).subscribe({
      next: () => {
        this.loadArticles();
        this.toastr.success('Bài viết đã được xóa thành công!', 'Thành công');
        this.loadStats();
      },
      error: (error) => {
        console.error('Error deleting article:', error);
        this.toastr.error('Không thể xóa bài viết. Vui lòng thử lại.', 'Lỗi');
      },
    });
  }

  private validateArticleForm(): boolean {
    this.errors = {};
    console.log('newArticle.categoryId:', this.newArticle.categoryId, 'Type:', typeof this.newArticle.categoryId);
    console.log('Categories:', this.categories.map(cat => ({ id: cat.id, name: cat.name })));

    const title = this.newArticle.title.trim();
    if (!title) {
      this.errors.title = 'Vui lòng nhập tiêu đề bài viết';
      return false;
    }
    if (title.length < 3) {
      this.errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
      return false;
    }
    if (title.length > 200) {
      this.errors.title = 'Tiêu đề không được vượt quá 200 ký tự';
      return false;
    }

    const content = this.newArticle.content.trim();
    if (!content) {
      this.errors.content = 'Vui lòng nhập nội dung bài viết';
      return false;
    }
    if (content.length < 10) {
      this.errors.content = 'Nội dung phải có ít nhất 10 ký tự';
      return false;
    }

    if (!this.newArticle.categoryId || !this.categories.some(cat => cat.id === this.newArticle.categoryId)) {
      this.errors.categoryId = this.categories.length === 0 ? 'Chưa có danh mục nào' : 'Vui lòng chọn danh mục hợp lệ';
      console.log('Category validation failed. Selected ID:', this.newArticle.categoryId);
      return false;
    }

    const imageUrl = this.newArticle.image_url?.trim() || '';
    if (imageUrl) {
      const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i;
      if (!urlRegex.test(imageUrl)) {
        this.errors.image_url = 'URL ảnh không hợp lệ (phải là PNG, JPG, JPEG, GIF, SVG hoặc WEBP)';
        return false;
      }
    }

    const status = this.newArticle.status || 'draft';
    if (!['draft', 'published'].includes(status)) {
      this.errors.status = 'Trạng thái bài viết không hợp lệ';
      return false;
    }

    return true;
  }

  private resetArticleForm(): void {
    this.newArticle = {
      title: '',
      content: '',
      image_url: '',
      status: 'draft',
      categoryId: this.categories.length > 0 ? this.categories[0].id : 0,
    };
    this.errors = {};
  }

  // User Management
  createUser(): void {
    if (!this.validateUserForm()) return;

    const createDto: CreateUserDto = {
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password,
      role: this.newUser.role,
    };

    this.apiService.createUser(createDto).subscribe({
      next: () => {
        this.loadUsers();
        this.resetUserForm();
        this.toastr.success('Người dùng đã được tạo thành công!', 'Thành công');
        this.loadStats();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        const errorMessage = error.error?.message || 'Không thể tạo người dùng. Vui lòng thử lại.';
        this.toastr.error(errorMessage, 'Lỗi');
      },
    });
  }

  editUser(): void {
    if (!this.editingUser || !this.validateUserForm(true)) return;

    const updateDto: UpdateUserDto = {
      email: this.newUser.email,
      role: this.newUser.role,
      password: this.newUser.password || undefined,
    };

    this.apiService.updateUser(this.editingUser.id, updateDto).subscribe({
      next: () => {
        this.loadUsers();
        this.cancelEditUser();
        this.toastr.success('Người dùng đã được cập nhật thành công!', 'Thành công');
      },
      error: (error) => {
        console.error('Error updating user:', error);
        const errorMessage = error.error?.message || 'Không thể cập nhật người dùng. Vui lòng thử lại.';
        this.toastr.error(errorMessage, 'Lỗi');
      },
    });
  }

  startEditUser(user: User): void {
    this.editingUser = { ...user };
    this.newUser = {
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      confirmPassword: '',
    };
    this.scrollToTop();
  }

  cancelEditUser(): void {
    this.editingUser = null;
    this.resetUserForm();
    this.errors = {};
  }

  deleteUser(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.')) {
      return;
    }

    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.toastr.success('Người dùng đã được xóa thành công!', 'Thành công');
        this.loadStats();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.toastr.error('Không thể xóa người dùng. Vui lòng thử lại.', 'Lỗi');
      },
    });
  }

  private validateUserForm(isEdit: boolean = false): boolean {
    this.errors = {};

    if (!isEdit) {
      const username = this.newUser.username.trim();
      if (!username) {
        this.errors.username = 'Vui lòng nhập tên người dùng';
        return false;
      }
      if (username.length < 3) {
        this.errors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
        return false;
      }
      if (username.length > 50) {
        this.errors.username = 'Tên người dùng không được vượt quá 50 ký tự';
        return false;
      }
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        this.errors.username = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
        return false;
      }
    }

    const email = this.newUser.email.trim();
    if (!email) {
      this.errors.email = 'Vui lòng nhập email';
      return false;
    }
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email.toLowerCase())) {
      this.errors.email = 'Email không hợp lệ';
      return false;
    }
    if (email.length > 100) {
      this.errors.email = 'Email không được vượt quá 100 ký tự';
      return false;
    }

    const password = this.newUser.password.trim();
    if (!isEdit && !password) {
      this.errors.password = 'Vui lòng nhập mật khẩu';
      return false;
    }
    if (password) {
      if (password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        return false;
      }
      if (password.length > 50) {
        this.errors.password = 'Mật khẩu không được vượt quá 50 ký tự';
        return false;
      }
      const confirmPassword = this.newUser.confirmPassword.trim();
      if (!confirmPassword) {
        this.errors.confirmPassword = 'Vui lòng nhập xác nhận mật khẩu';
        return false;
      }
      if (password !== confirmPassword) {
        this.errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        return false;
      }
    }

    const role = this.newUser.role || 'user';
    if (!['user', 'admin'].includes(role)) {
      this.errors.role = 'Vai trò không hợp lệ';
      return false;
    }

    return true;
  }

  private resetUserForm(): void {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      role: 'user',
      confirmPassword: '',
    };
    this.errors = {};
  }

  private scrollToTop(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  logout(): void {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      this.authService.logout();
      this.toastr.info('Đã đăng xuất thành công', 'Thông báo');
    }
  }

  refreshData(): void {
    this.loadAllData();
    this.toastr.info('Dữ liệu đã được làm mới', 'Thông báo');
  }

  logCategoryChange(categoryId: number): void {
    console.log('Selected categoryId:', categoryId, 'Type:', typeof categoryId);
  }

  getArticleStatusText(status: string): string {
    return status === 'published' ? 'Đã xuất bản' : 'Nháp';
  }

  getUserRoleText(role: string): string {
    return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
  }

  trackByArticleId(index: number, article: Article): number {
    return article.id;
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }
}