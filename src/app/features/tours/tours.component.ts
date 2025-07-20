import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

interface Tour {
  id: number;
  title: string;
  location: string;
  image: string;
  price: number;
  discount?: number;
  duration: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  description: string;
  itinerary: ItineraryItem[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements OnInit {
  tours: Tour[] = [
    {
      id: 1,
      title: "Tour Hạ Long - Sapa 4N3Đ",
      location: "Hạ Long - Sapa",
        image: 'https://cdn2.ivivu.com/2022/07/21/13/ivivu-dong-batu-750x460.gif',
      price: 6500000,
      discount: 15,
      duration: "4 ngày 3 đêm",
      rating: 4.8,
      reviewCount: 124,
      isFavorite: false,
      description: "Khám phá vẻ đẹp thiên nhiên hùng vĩ của Vịnh Hạ Long và cao nguyên Sapa với những thửa ruộng bậc thang tuyệt đẹp.",
      itinerary: [
        { day: 1, title: "Hà Nội - Hạ Long", description: "Khởi hành từ Hà Nội, tham quan Vịnh Hạ Long, du thuyền qua đảo Titop, hang Sửng Sốt. Nghỉ đêm trên du thuyền." },
        { day: 2, title: "Hạ Long - Sapa", description: "Tham quan thêm các điểm đẹp ở Hạ Long, sau đó di chuyển về Sapa. Check-in khách sạn và nghỉ ngơi." },
        { day: 3, title: "Sapa - Bản Cát Cát", description: "Trekking thăm bản Cát Cát, tìm hiểu văn hóa dân tộc H'Mông, ngắm ruộng bậc thang." },
        { day: 4, title: "Sapa - Hà Nội", description: "Chinh phục đỉnh Fansipan bằng cáp treo, sau đó trở về Hà Nội." }
      ]
    },
    {
      id: 2,
      title: "Tour Phú Quốc 3N2Đ",
      location: "Phú Quốc",
      image: 'https://cdn2.ivivu.com/2019/10/02/14/ivivu-singapore9-750x460.jpg',
      price: 4200000,
      duration: "3 ngày 2 đêm",
      rating: 4.6,
      reviewCount: 89,
      isFavorite: true,
      description: "Tận hưởng kỳ nghỉ tuyệt vời tại đảo ngọc Phú Quốc với những bãi biển đẹp nhất Việt Nam.",
      itinerary: [
        { day: 1, title: "TP.HCM - Phú Quốc", description: "Bay từ TP.HCM đến Phú Quốc, check-in resort, tự do tắm biển và thư giãn." },
        { day: 2, title: "Tour 4 đảo", description: "Tham quan 4 đảo: Hòn Thơm, Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Lặn ngắm san hô, câu cá." },
        { day: 3, title: "Phú Quốc - TP.HCM", description: "Tham quan vườn tiêu, làng chài Hàm Ninh, mua sắm đặc sản trước khi bay về TP.HCM." }
      ]
    },
    {
      id: 3,
      title: "Tour Đà Nẵng - Hội An 3N2Đ",
      location: "Đà Nẵng - Hội An",
        image: 'https://cdn2.ivivu.com/2025/03/28/13/ivv-dao-co-to-360x225.gif',
      price: 3800000,
      duration: "3 ngày 2 đêm",
      rating: 4.7,
      reviewCount: 156,
      isFavorite: false,
      description: "Khám phá thành phố Đà Nẵng hiện đại và phố cổ Hội An thơ mộng với những ngôi nhà cổ kính.",
      itinerary: [
        { day: 1, title: "Hà Nội - Đà Nẵng", description: "Bay từ Hà Nội, tham quan Bà Nà Hills, cầu Vàng nổi tiếng. Nghỉ đêm tại Đà Nẵng." },
        { day: 2, title: "Đà Nẵng - Hội An", description: "Tham quan phố cổ Hội An, chùa Cầu, nhà cổ Tấn Ký. Thả đèn hoa đăng trên sông Hoài." },
        { day: 3, title: "Hội An - Đà Nẵng", description: "Làng rau Trà Quế, bãi biển An Bàng, mua sắm đặc sản trước khi bay về Hà Nội." }
      ]
    },
    {
      id: 4,
      title: "Tour Đà Lạt 2N1Đ",
      location: "Đà Lạt",
        image: 'https://cdn2.ivivu.com/2017/07/05/17/ivivu-cung-dien-kyeongbok-541fe56bb7be6-360x225.jpg',
      price: 2500000,
      discount: 10,
      duration: "2 ngày 1 đêm",
      rating: 4.5,
      reviewCount: 98,
      isFavorite: false,
      description: "Tận hưởng không khí mát mẻ của thành phố ngàn hoa với những cảnh đẹp lãng mạn.",
      itinerary: [
        { day: 1, title: "TP.HCM - Đà Lạt", description: "Bay từ TP.HCM, tham quan hồ Xuân Hương, chợ đêm Đà Lạt. Nghỉ đêm tại khách sạn." },
        { day: 2, title: "Đà Lạt - TP.HCM", description: "Tham quan thác Elephant, ga Đà Lạt, vườn hoa thành phố trước khi bay về TP.HCM." }
      ]
    },
    {
      id: 5,
      title: "Tour Nha Trang 4N3Đ",
      location: "Nha Trang",
        image: 'https://cdn2.ivivu.com/2024/06/14/11/pattaya-ivv-360x225.gif',
      price: 5200000,
      duration: "4 ngày 3 đêm",
      rating: 4.4,
      reviewCount: 112,
      isFavorite: true,
      description: "Khám phá thành phố biển Nha Trang với những bãi biển tuyệt đẹp và hoạt động thể thao dưới nước phong phú.",
      itinerary: [
        { day: 1, title: "Hà Nội - Nha Trang", description: "Bay từ Hà Nội, check-in khách sạn, tự do tắm biển và thư giãn." },
        { day: 2, title: "Tour 4 đảo Nha Trang", description: "Tham quan đảo Hòn Mun, Hòn Tằm, lặn ngắm san hô, tắm bùn khoáng." },
        { day: 3, title: "Tham quan thành phố", description: "Tháp Bà Ponagar, chùa Long Sơn, thăm làng chài Hòn Chồng." },
        { day: 4, title: "Nha Trang - Hà Nội", description: "Tự do mua sắm, thư giãn trước khi bay về Hà Nội." }
      ]
    },
    {
      id: 6,
      title: "Tour Cần Thơ - Miền Tây 3N2Đ",
      location: "Cần Thơ",
        image: 'https://cdn2.ivivu.com/2025/04/15/11/sunset-ivv-360x225.gif',
      price: 3200000,
      duration: "3 ngày 2 đêm",
      rating: 4.3,
      reviewCount: 76,
      isFavorite: false,
      description: "Khám phá vùng đất phù sa màu mỡ của miền Tây Nam Bộ với chợ nổi Cái Răng và vườn trái cây.",
      itinerary: [
        { day: 1, title: "TP.HCM - Cần Thơ", description: "Khởi hành từ TP.HCM, tham quan chợ nổi Cái Răng, vườn trái cây." },
        { day: 2, title: "Cần Thơ - Sóc Trăng", description: "Tham quan chùa Khmer, làng nghề bánh tráng, về Cần Thơ nghỉ đêm." },
        { day: 3, title: "Cần Thơ - TP.HCM", description: "Mua sắm đặc sản miền Tây, trở về TP.HCM." }
      ]
    }
  ];

  currentTours: Tour[] = [];
  selectedTour: Tour | null = null;
  showModal = false;
  sortBy = 'popular';
  searchParams = {
    destination: '',
    departure: '',
    guests: '1'
  };
  filterParams = {
    duration: '',
    priceRange: ''
  };
  bookingForm = {
    name: '',
    phone: '',
    email: '',
    date: '',
    adults: '1',
    children: '0'
  };
  isBooking = false;
  adultPrice = 0;
  childPrice = 0;
  adultsTotal = 0;
  childrenTotal = 0;
  totalPrice = 0;

  ngOnInit() {
    this.currentTours = [...this.tours];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.bookingForm.date = tomorrow.toISOString().split('T')[0];

    // Kiểm tra định dạng duration
    this.tours.forEach(tour => {
      if (!tour.duration.match(/\d+/)) {
        console.warn(`Định dạng duration không hợp lệ cho tour: ${tour.title}`);
      }
    });
  }

  formatPrice(price: number | undefined): string {
    if (!price) return '0₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  toggleFavorite(tourId: number) {
    const tour = this.tours.find(t => t.id === tourId);
    if (tour) {
      tour.isFavorite = !tour.isFavorite;
      this.currentTours = [...this.currentTours];
    }
  }

  openTourDetail(tour: Tour) {
    this.selectedTour = tour;
    this.updateBookingPrice();
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(event?: MouseEvent) {
    if (event && event.target !== event.currentTarget) return;
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  updateBookingPrice() {
    if (!this.selectedTour) return;

    const adults = parseInt(this.bookingForm.adults);
    const children = parseInt(this.bookingForm.children);
    
    this.adultPrice = this.selectedTour.discount ? 
      this.selectedTour.price * (1 - this.selectedTour.discount / 100) : 
      this.selectedTour.price;
    
    this.childPrice = this.adultPrice * 0.7;
    this.adultsTotal = adults * this.adultPrice;
    this.childrenTotal = children * this.childPrice;
    this.totalPrice = this.adultsTotal + this.childrenTotal;
  }

  submitBooking() {
    if (!this.selectedTour) return;

    const { name, phone, email, date } = this.bookingForm;

    if (!name || !phone || !email || !date) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    this.isBooking = true;

    setTimeout(() => {
      alert(`Đặt tour thành công!\n\nThông tin đặt tour:\n- Tour: ${this.selectedTour!.title}\n- Khách hàng: ${name}\n- Số điện thoại: ${phone}\n- Email: ${email}\n- Ngày khởi hành: ${date}\n\nChúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!`);
      
      this.isBooking = false;
      this.closeModal();
    }, 2000);
  }

  sortTours() {
    switch(this.sortBy) {
      case 'price-low':
        this.currentTours.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        this.currentTours.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        this.currentTours.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this.currentTours.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    this.currentTours = [...this.currentTours];
  }

  filterTours() {
    const { duration, priceRange } = this.filterParams;

    this.currentTours = this.tours.filter(tour => {
      let matchDuration = true;
      let matchPrice = true;

      if (duration) {
        const match = tour.duration.match(/\d+/);
        const days = match ? parseInt(match[0]) : 0; // Mặc định là 0 nếu không có kết quả
        switch (duration) {
          case '1-3':
            matchDuration = days >= 1 && days <= 3;
            break;
          case '4-7':
            matchDuration = days >= 4 && days <= 7;
            break;
          case '7+':
            matchDuration = days > 7;
            break;
        }
      }

      if (priceRange) {
        const price = tour.discount ? tour.price * (1 - tour.discount / 100) : tour.price;
        switch (priceRange) {
          case '0-5000000':
            matchPrice = price < 5000000;
            break;
          case '5000000-10000000':
            matchPrice = price >= 5000000 && price <= 10000000;
            break;
          case '10000000+':
            matchPrice = price > 10000000;
            break;
        }
      }

      return matchDuration && matchPrice;
    });
  }

  searchTours() {
    // Triển khai chức năng tìm kiếm dựa trên searchParams
    // Đây là placeholder cho triển khai tìm kiếm thực tế
    this.filterTours();
  }
}