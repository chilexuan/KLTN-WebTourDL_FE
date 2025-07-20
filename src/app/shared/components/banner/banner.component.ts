import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [RouterLink, NgStyle]
})
export class BannerComponent {
  @Input() title: string = 'Default Title';
  @Input() bannerImage: string = 'https://via.placeholder.com/1920x800';
  @Input() showBreadcrumbs: boolean = true;
  @Input() breadcrumbs: Breadcrumb[] = [];
}