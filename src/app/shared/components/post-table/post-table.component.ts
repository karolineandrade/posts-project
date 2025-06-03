import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { TuiTable, TuiTablePagination, tuiTablePaginationOptionsProvider } from '@taiga-ui/addon-table';
import { TuiHint, TuiAutoColorPipe, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiTooltip, TuiAvatar, TuiPagination, TuiButtonSelect, TuiDataListWrapper, TuiSkeleton } from '@taiga-ui/kit';
import { TuiContext, TuiStringHandler } from '@taiga-ui/cdk/types';
import { FormsModule } from '@angular/forms';
import { PostInterface } from '../../interface/PostInterface';

@Component({
  selector: 'app-post-table',
  templateUrl: './post-table.component.html',
  styleUrls: ['./post-table.component.css'],
  imports: [CommonModule, FormsModule, TuiTable, TuiTooltip, TuiHint, TuiAvatar, TuiAutoColorPipe, TuiButton, TuiPagination,
    TuiButtonSelect, TuiDataListWrapper, TuiIcon, TuiTablePagination, TuiSkeleton],
  providers: [
    tuiTablePaginationOptionsProvider({
      showPages: true
    }),
  ],
})
export class PostTableComponent implements OnInit {
  public posts = input<PostInterface[]>();
  public paginatedPosts = input<PostInterface[]>();
  public pageIndex = input<number>();
  public pageSize = input<number>();
  public pageSizeOptions = input<number[]>();
  public resultsLength = input<number>();
  public isLoadingResults = input<boolean>();
  public displayedColumns: string[] = ['number', 'title', 'user', 'body', 'actions'];
  public selectedPageSize: number = 10;

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() onViewPost = new EventEmitter<PostInterface>();
  @Output() onEditPost = new EventEmitter<PostInterface>();
  @Output() onDeletePost = new EventEmitter<number>();


  protected readonly content: TuiStringHandler<TuiContext<number>> = ({$implicit}) =>
    `Exibindo ${$implicit}`;

  constructor() { }

  ngOnInit(): void {
    this.selectedPageSize = this.pageSize()!;
  }
  onPageChange(index: number) {
    this.pageChange.emit({ pageIndex: index, pageSize: this.pageSize()! });
  }

  onPageSizeChange(size: number) {
    this.pageChange.emit({ pageIndex: 0, pageSize: size });
  }

  view(post: PostInterface): void {
    this.onViewPost.emit(post);
  }

  edit(post: PostInterface): void {
    this.onEditPost.emit(post);
  }

  delete(index: number): void {
    this.onDeletePost.emit(index);
  }

}
