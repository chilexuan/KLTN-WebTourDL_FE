import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  standalone: true,
  imports: [FormsModule, NgStyle]
})
export class NewsletterComponent {
  @Input() backgroundImage: string = 'https://via.placeholder.com/1920x800';
  email: string = '';

  onSubmit() {
    // Xử lý đăng ký newsletter
    console.log('Email đăng ký:', this.email);
    // Reset form
    this.email = '';
    // Thông báo thành công (trong thực tế, bạn có thể sử dụng service thông báo)
    alert('Đăng ký nhận tin thành công!');
  }
}