// src/app/core/components/header/header.component.ts
import { Component, HostListener, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgClass } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  mobileMenuOpen = false;
  isSticky = false;
  headerHeight = 120; // Giá trị mặc định
  isUserDropdownOpen = false; // Thêm trạng thái cho dropdown user
  @ViewChild('userDropdown') userDropdown!: ElementRef; // Tham chiếu đến userDropdown
  private isBrowser: boolean;

  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router // Inject Router để điều hướng
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Không làm gì với document trong ngOnInit
  }

  ngAfterViewInit() {
    // Chỉ chạy trong browser và sau khi view đã được render
    if (this.isBrowser) {
      setTimeout(() => {
        try {
          const headerElement = document.querySelector('.header') as HTMLElement;
          if (headerElement) {
            this.headerHeight = headerElement.offsetHeight;
          }
        } catch (error) {
          console.warn('Could not get header height:', error);
          // Sử dụng giá trị mặc định
          this.headerHeight = 120;
        }
      }, 100);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Chỉ chạy trong browser
    if (!this.isBrowser || typeof window === 'undefined') return;

    try {
      const scrollPosition = window.pageYOffset || 0;
      const triggerHeight = this.headerHeight + 50;
      
      if (scrollPosition > triggerHeight && !this.isSticky) {
        this.isSticky = true;
        this.updateBodyPadding(this.headerHeight);
      } else if (scrollPosition <= triggerHeight && this.isSticky) {
        this.isSticky = false;
        this.updateBodyPadding(0);
      }
    } catch (error) {
      console.warn('Error in scroll handler:', error);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    // Đóng dropdown khi nhấp ra ngoài
    if (this.isBrowser && this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.isUserDropdownOpen = false;
    }
  }

  private updateBodyPadding(padding: number): void {
    if (this.isBrowser && typeof document !== 'undefined' && document.body) {
      try {
        document.body.style.paddingTop = `${padding}px`;
      } catch (error) {
        console.warn('Could not update body padding:', error);
      }
    }
  }

  private updateBodyOverflow(overflow: string): void {
    if (this.isBrowser && typeof document !== 'undefined' && document.body) {
      try {
        document.body.style.overflow = overflow;
      } catch (error) {
        console.warn('Could not update body overflow:', error);
      }
    }
  }

  ngOnDestroy() {
    // Cleanup khi component bị destroy
    if (this.isBrowser) {
      this.updateBodyPadding(0);
      this.updateBodyOverflow('auto');
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    // Prevent body scroll when mobile menu is open
    if (this.mobileMenuOpen) {
      this.updateBodyOverflow('hidden');
    } else {
      this.updateBodyOverflow('auto');
    }
  }

  // Toggle dropdown user
  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  // Đóng dropdown khi nhấp vào một tùy chọn
  closeUserDropdown() {
    this.isUserDropdownOpen = false;
  }

  // Điều hướng đến user-profile khi chọn "Đổi thông tin"
  navigateToProfile() {
    this.router.navigate(['/user-profile']);
    this.closeUserDropdown();
  }

  // Xử lý đăng xuất
  logout(): void {
    if (this.isBrowser && typeof window !== 'undefined') {
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        this.authService.logout();
        this.router.navigate(['/auth'], { queryParams: { mode: 'signin' } });
        this.closeUserDropdown(); // Đóng dropdown sau khi đăng xuất
      }
    } else {
      // Fallback cho SSR
      this.authService.logout();
    }
  }
}