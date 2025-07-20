import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  details: string[];
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  contactInfo: ContactInfo[] = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Địa chỉ',
      details: [
        '123 Đường Nguyễn Văn Linh',
        'Quận Hải Châu, Đà Nẵng',
        'Việt Nam'
      ]
    },
    {
      icon: 'fas fa-phone',
      title: 'Điện thoại',
      details: [
        '+84 236 123 4567',
        '+84 901 234 567'
      ]
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      details: [
        'info@dulichvietnam.com',
        'booking@dulichvietnam.com'
      ]
    },
    {
      icon: 'fas fa-clock',
      title: 'Giờ làm việc',
      details: [
        'Thứ 2 - Thứ 6: 8:00 - 18:00',
        'Thứ 7 - Chủ nhật: 8:00 - 17:00'
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitError = false;

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} là bắt buộc`;
      if (field.errors['email']) return 'Email không hợp lệ';
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} phải có ít nhất ${requiredLength} ký tự`;
      }
      if (field.errors['pattern']) return 'Số điện thoại không hợp lệ';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      subject: 'Chủ đề',
      message: 'Tin nhắn'
    };
    return labels[fieldName] || fieldName;
  }
}