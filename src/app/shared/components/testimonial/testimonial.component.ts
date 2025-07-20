import { Component, Input } from '@angular/core';

export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  location: string;
  content: string;
  rating: number;
}

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss'],
  standalone: true
})
export class TestimonialComponent {
  @Input() testimonial!: Testimonial;
}