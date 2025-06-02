import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { TuiAutoColorPipe, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar, TuiSkeleton } from '@taiga-ui/kit';
import { CommentInterface } from '../../interface/CommentInterface';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.css'],
  imports: [TuiAvatar, TuiAutoColorPipe, TuiIcon, TuiButton, TuiSkeleton]
})
export class CommentItemComponent {
  public comment = input<CommentInterface>();
  public isLoading = input<boolean>();
  @Output() onEdit = new EventEmitter<CommentInterface>();
  @Output() onDelete = new EventEmitter<number >();

  constructor() { }

  editComment(): void {
    this.onEdit.emit(this.comment());
  }

   deleteComment(index: number): void {
    this.onDelete.emit(index);
  }
  getFirstChar(fullName: string): string {
  return fullName.charAt(0).toUpperCase();
}
}
