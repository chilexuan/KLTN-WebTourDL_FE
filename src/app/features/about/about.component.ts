import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Feature {
  title: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  features: Feature[] = [
    {
      title: 'Bài viết du lịch chất lượng',
      icon: '📝',
      description: 'Những bài viết được viết từ trải nghiệm thực tế, với thông tin chi tiết về điểm đến, ẩm thực, văn hóa và những mẹo hay cho du khách.'
    },
    {
      title: 'Hướng dẫn du lịch chi tiết',
      icon: '🗺️',
      description: 'Lộ trình cụ thể, mẹo vặt, kinh nghiệm thực tế giúp bạn có những chuyến du lịch hoàn hảo và tiết kiệm nhất.'
    },
    {
      title: 'Gợi ý tour du lịch',
      icon: '🎒',
      description: 'Tuyển chọn và giới thiệu những tour du lịch chất lượng từ các đối tác uy tín, phù hợp với nhiều nhu cầu và ngân sách khác nhau.'
    },
    {
      title: 'Chia sẻ trải nghiệm',
      icon: '📸',
      description: 'Nền tảng để cộng đồng du lịch chia sẻ những câu chuyện, hình ảnh và kinh nghiệm du lịch độc đáo của mình.'
    },
    {
      title: 'Mẹo du lịch thông minh',
      icon: '💡',
      description: 'Những bí quyết, mẹo vặt giúp bạn du lịch an toàn, tiết kiệm và có những trải nghiệm đáng nhớ nhất.'
    },
    {
      title: 'Khám phá điểm đến mới',
      icon: '🌟',
      description: 'Giới thiệu những điểm đến ít người biết, những trải nghiệm độc đáo chưa được khám phá rộng rãi.'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }

  viewBlog(): void {
    // Navigate to blog page
    this.router.navigate(['/blog']);
  }

  viewTours(): void {
    // Navigate to tours page
    this.router.navigate(['/tours']);
  }

  // Method to handle smooth scrolling to sections
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // Method to animate numbers (can be used with Intersection Observer)
  animateNumber(target: number, duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      const element = document.querySelector('.stat-number');
      if (!element) {
        resolve();
        return;
      }

      const start = 0;
      const increment = target / (duration / 16); // 60fps
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          resolve();
        }
        element.textContent = Math.floor(current).toString();
      }, 16);
    });
  }

  // Method to handle intersection observer for animations
  setupIntersectionObserver(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe elements that should be animated
    const animatedElements = document.querySelectorAll('.mission-card, .feature-card, .stat-item');
    animatedElements.forEach(el => observer.observe(el));
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }
}