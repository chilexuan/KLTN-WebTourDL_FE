import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

export interface Tour {
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
}

@Component({
  selector: 'app-tour-card',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.scss'],
  standalone: true,
  imports: [RouterLink, CurrencyPipe]
})
export class TourCardComponent {
  @Input() tour!: Tour;
  @Output() favoriteChanged = new EventEmitter<{id: number, isFavorite: boolean}>();

  toggleFavorite() {
    this.tour.isFavorite = !this.tour.isFavorite;
    this.favoriteChanged.emit({
      id: this.tour.id,
      isFavorite: this.tour.isFavorite
    });
  }
}