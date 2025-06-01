import { PostInterface } from './../shared/interface/PostInterface';
import { ChangeDetectionStrategy, Component, inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PostsService } from '../shared/service/posts.service';
import { CommonModule } from '@angular/common';
import {tuiDialog, TuiIcon, TuiIconPipe} from '@taiga-ui/core';
import {TuiTable, TuiTablePaginationEvent} from '@taiga-ui/addon-table';
import {TuiButton} from '@taiga-ui/core';
import { TuiTablePagination, tuiTablePaginationOptionsProvider} from '@taiga-ui/addon-table';
import {TuiSkeleton} from '@taiga-ui/kit';
import { AlertsService } from '../shared/service/alerts.service';
import { DialogPostComponent } from './dialog-post/dialog-post.component';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  imports: [CommonModule, TuiTable, TuiButton, TuiIcon, TuiTablePagination, TuiSkeleton ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
        tuiTablePaginationOptionsProvider({
            showPages: true
        }),
    ],

})
export class PostsComponent implements OnInit, OnChanges {
  private postsService: PostsService = inject(PostsService);
  private alertService: AlertsService = inject(AlertsService);

  public posts: PostInterface[] = [];
  public displayedColumns: string[] = ['number', 'title', 'body', 'actions'];
  public resultsLength = 0;
  public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions = [10, 20, 50, 100];
  public isLoadingResults = true;
  public isRateLimitReached = false;
  public isEdit = false;
  public label = 'Adicionar';

  private dialog = tuiDialog(DialogPostComponent, {
        dismissible: true,
        label: this.label,
    });


  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEdit']) {
      this.label = this.isEdit ? 'Editar' : 'Adicionar';
    }
  }

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

newPost(data: any): void {
  let newP: PostInterface = {
    title: data.title,
    body: data.body,
    userId: Math.floor(Math.random() * 7)
  }

  this.postsService.createPost(newP).subscribe({
    next: (response) => {
      console.log(response)
        this.alertService.showSuccessAlert('Post criado com sucesso.');

    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível criar novo post.');
     }
  })
}

editPost(data: any, postId: number | undefined): void {
  let newP: PostInterface = {
    title: data.title,
    body: data.body,
    id: postId
  }

  this.postsService.patchPost(newP).subscribe({
    next: (response) => {
      console.log(response)
        this.alertService.showSuccessAlert('Post editado com sucesso.');

    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível editar post.');
     }
  })
}

deletePost(index: number): void {
  this.postsService.deletePost(index).subscribe({
    next: (response) => {
      console.log(response)
        this.alertService.showSuccessAlert('Post deletado.');
      this.posts = this.posts.filter(post => post.id !== index);
    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível deletar post.');
     }
  })
}

showDialogPost(isEdit: boolean, post?: PostInterface): void {
  this.isEdit = isEdit
  console.log(isEdit)
    this.dialog(post).subscribe({
        next: (data) => {
            console.info(`Dialog emitted data = ${data}`);
            if(isEdit) {
              this.editPost(data, post?.id);
            } else {
            this.newPost(data);
            }
        },
        complete: () => {
          this.listAllPosts();
            console.info('Dialog closed');
        },


    });
}

}
