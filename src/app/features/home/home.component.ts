import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TourCardComponent, Tour } from '../../shared/components/tour-card/tour-card.component';
import { TestimonialComponent, Testimonial } from '../../shared/components/testimonial/testimonial.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TourCardComponent,
    TestimonialComponent,
    NewsletterComponent
  ]
})
export class HomeComponent {
  // Danh sách tour phổ biến
  popularTours: Tour[] = [
    {
      id: 1,
      title: 'Khám phá vịnh Hạ Long 2 ngày 1 đêm',
      location: 'Hạ Long, Quảng Ninh',
      image: 'https://cdn2.ivivu.com/2022/07/21/13/ivivu-dong-batu-750x460.gif',
      price: 1950000,
      duration: '2 ngày 1 đêm',
      rating: 5,
      reviewCount: 28,
      isFavorite: false
    },
    {
      id: 2,
      title: 'Tour Đà Nẵng - Hội An - Bà Nà Hills',
      location: 'Đà Nẵng',
      image: 'https://cdn2.ivivu.com/2019/10/02/14/ivivu-singapore9-750x460.jpg',
      price: 3500000,
      discount: 15,
      duration: '4 ngày 3 đêm',
      rating: 4,
      reviewCount: 42,
      isFavorite: true
    },
    {
      id: 3,
      title: 'Khám phá Phú Quốc - Thiên đường biển đảo',
      location: 'Phú Quốc, Kiên Giang',
      image: 'https://cdn2.ivivu.com/2019/10/02/14/ivivu-singapore9-750x460.jpg',
      price: 4200000,
      duration: '3 ngày 2 đêm',
      rating: 5,
      reviewCount: 35,
      isFavorite: false
    }
  ];

  // Danh sách testimonial
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://cdn2.ivivu.com/2019/10/02/14/ivivu-singapore9-750x460.jpg',
      location: 'Hà Nội',
      content: 'Chuyến đi Hạ Long thật tuyệt vời! Hướng dẫn viên rất nhiệt tình, chuyên nghiệp. Tôi sẽ tiếp tục sử dụng dịch vụ của SafeTours trong những chuyến đi tới.',
      rating: 5
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://via.placeholder.com/100x100',
      location: 'TP. Hồ Chí Minh',
      content: 'Đây là lần thứ 3 sử dụng dịch vụ của SafeTours và tôi vẫn luôn hài lòng. Tour Đà Nẵng rất hợp lý về thời gian và giá cả.',
      rating: 4
    },
    {
      id: 3,
      name: 'Lê Văn C',
      avatar: 'https://via.placeholder.com/100x100',
      location: 'Đà Nẵng',
      content: 'Tour Phú Quốc quá tuyệt vời, từ dịch vụ, lịch trình đến hướng dẫn viên đều rất chuyên nghiệp. Sẽ giới thiệu cho bạn bè và người thân.',
      rating: 5
    }
  ];

  // Xử lý sự kiện khi thay đổi trạng thái yêu thích
  onFavoriteChanged(event: {id: number, isFavorite: boolean}) {
    const tourIndex = this.popularTours.findIndex(tour => tour.id === event.id);
    if (tourIndex !== -1) {
      this.popularTours[tourIndex].isFavorite = event.isFavorite;
    }
  }
}