import { PostInterface } from './../shared/interface/PostInterface';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PostsService } from '../shared/service/posts.service';
import {merge, Observable, of as observableOf} from 'rxjs';
import { CommonModule } from '@angular/common';
import {TuiIcon, TuiIconPipe} from '@taiga-ui/core';
import {TuiTable, TuiTablePaginationEvent} from '@taiga-ui/addon-table';
import {TuiButton} from '@taiga-ui/core';
import { TuiTablePagination, tuiTablePaginationOptionsProvider} from '@taiga-ui/addon-table';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  imports: [CommonModule, TuiTable, TuiButton, TuiIcon, TuiTablePagination ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
        tuiTablePaginationOptionsProvider({
            showPages: true
        }),
    ],

})
export class PostsComponent implements OnInit {
  private postsService: PostsService = inject(PostsService);

  public posts: PostInterface[] = [];
  public displayedColumns: string[] = ['number', 'title', 'body', 'actions'];
  posts$!: Observable<PostInterface[]>;

  public resultsLength = 0;
public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions = [10, 20, 50, 100];
  public isLoadingResults = true;
  public isRateLimitReached = false;

  constructor() { }

  ngOnInit() {
    this.listAllPosts();
  }


private listAllPosts(): void {
  this.postsService.getAllPosts()
    .subscribe({
      next: (response) => {
       this.isLoadingResults = false;
          this.posts = response;
          this.resultsLength = response.length;
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
      }
    });
}

    onPageChange(event: TuiTablePaginationEvent) {
  this.pageIndex = event.page ?? this.pageIndex;
  this.pageSize = event.size ?? this.pageSize;
}


paginatedData() {
  if (this.pageSize <= 0 || this.pageIndex < 0) {
    return [];
  }

  const start = this.pageIndex * this.pageSize;
  const end = start + this.pageSize;
  return this.posts.slice(start, end);
}



}
