import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { PostInterface } from '../../interface/PostInterface';
import { TuiAppearance, TuiAutoColorPipe, TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiChevron, TuiSkeleton } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import {TuiSwipeActions} from '@taiga-ui/addon-mobile';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css'],
  imports: [CommonModule, TuiAppearance, TuiDataList,
        TuiDropdown, TuiBadge, TuiButton, TuiCardLarge, TuiHeader, TuiChevron, TuiAvatar, TuiAutoColorPipe, TuiIcon, TuiSkeleton, TuiSwipeActions
  ]
})
export class PostItemComponent {
  public post = input<PostInterface>();
  public isLoading = input<boolean>();

  @Output() onViewPost = new EventEmitter<PostInterface>();
  @Output() onEditPost = new EventEmitter<PostInterface>();
  @Output() onDeletePost = new EventEmitter<number>();
  constructor() { }

  view(): void {
    this.onViewPost.emit(this.post());
  }

  edit(): void {
    this.onEditPost.emit(this.post());
  }

  delete(): void {
    this.onDeletePost.emit(this.post()?.id);
  }

  getFirstChar(fullName: string): string {
  return fullName.charAt(0).toUpperCase();
}
}
