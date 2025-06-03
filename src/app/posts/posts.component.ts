import { PostInterface } from './../shared/interface/PostInterface';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnChanges, OnInit, signal, SimpleChanges, ViewChild } from '@angular/core';
import { PostsService } from '../shared/service/posts.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import {tuiDialog, TuiDropdown, TuiIcon, TuiPopup} from '@taiga-ui/core';
import {TuiTable, TuiTablePaginationEvent} from '@taiga-ui/addon-table';
import {TuiButton} from '@taiga-ui/core';
import { TuiTablePagination, tuiTablePaginationOptionsProvider} from '@taiga-ui/addon-table';
import {TuiSkeleton} from '@taiga-ui/kit';
import { AlertsService } from '../shared/service/alerts.service';
import { DialogPostComponent } from './dialog-post/dialog-post.component';
import { StorageService } from '../shared/service/storage.service';
import { CommentsComponent } from '../comments/comments.component';
import {TuiDrawer} from '@taiga-ui/kit';
import {TuiButtonSelect, TuiDataListWrapper, TuiPagination} from '@taiga-ui/kit';
import { TuiContext, TuiStringHandler } from '@taiga-ui/cdk/types';
import { FormsModule } from '@angular/forms';
import {TuiCell, TuiHeader} from '@taiga-ui/layout';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiAutoColorPipe, TuiHint} from '@taiga-ui/core';
import {TuiTooltip} from '@taiga-ui/kit';
import {TuiBreakpointService} from '@taiga-ui/core';
import { PostTableComponent } from "../shared/components/post-table/post-table.component";
import { PostItemComponent } from "../shared/components/post-item/post-item.component";
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  imports: [CommonModule, FormsModule, TuiTable, TuiTooltip, TuiDropdown,
    TuiHint, TuiAvatar, TuiAutoColorPipe, TuiButton, TuiPagination, TuiButtonSelect, TuiHeader,
    TuiDataListWrapper, TuiIcon, TuiTablePagination, TuiSkeleton, TuiDrawer, TuiPopup, AsyncPipe,
    CommentsComponent, PostTableComponent, PostItemComponent],
  providers: [
    tuiTablePaginationOptionsProvider({
      showPages: true
    }),
  ],

})
export class PostsComponent implements OnInit, OnChanges {
  private postsService: PostsService = inject(PostsService);
  private alertService: AlertsService = inject(AlertsService);
  private storageService: StorageService = inject(StorageService);
  protected readonly breakpoint$ = inject(TuiBreakpointService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  readonly openDrawer = signal(false);

  public posts: PostInterface[] = [];
  public resultsLength = 0;
  public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions = [10, 20, 50, 100];
  public isLoadingResults = true;
  public isRateLimitReached = false;
  public isEdit = false;
  public addComment = false;
  public label = 'Adicionar';
  public selectedPost!: PostInterface;

  private dialog = tuiDialog(DialogPostComponent, {
    dismissible: true,
    label: this.label,
  });

  protected readonly content: TuiStringHandler<TuiContext<number>> = ({$implicit}) =>
    `Exibindo ${$implicit}`;


  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEdit']) {
      this.label = this.isEdit ? 'Editar' : 'Adicionar';
    }
  }

  ngOnInit() {
    const storageList = this.storageService.getFromStorage('posts');

    if(storageList === null) {
      this.listAllPosts();
    }
    this.listPostsStorage();


  }


  private listAllPosts(): void {
    this.postsService.getAllPosts()
      .subscribe({
        next: (response) => {
          this.isLoadingResults = false;
          // this.posts = response;
          // this.resultsLength = response.length;
          this.storageService.saveToStorage('posts', JSON.stringify(response))
        },
        error: (err: Error) => {
          console.error(err);
          this.isLoadingResults = false;
        }
      });
  }

  private listPostsStorage(): void {
    this.isLoadingResults = false;
    const storageList = this.storageService.getFromStorage('posts');
    this.posts = storageList ? JSON.parse(storageList) as PostInterface[] : [];
    this.resultsLength = this.posts.length;
    this.cdr.markForCheck();

  }


  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
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
    this.isLoadingResults = true;
    this.postsService.createPost(newP).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.alertService.showSuccessAlert('Post criado com sucesso.');
        this.newPostToStorage(response);
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível criar novo post.');
      }
    })
  }

  newPostToStorage(data: PostInterface): void {
    this.posts.push(data);
    this.storageService.saveToStorage('posts', JSON.stringify(this.posts));
    console.log(data)
    this.listPostsStorage();
  }

  editPost(data: any, postId: number | undefined): void {
    this.isLoadingResults = true;

    let newP: PostInterface = {
      title: data.title,
      body: data.body,
      id: postId
    }

    this.postsService.patchPost(newP).subscribe({
      next: (response) => {
        this.editPostStorage(response);
        this.isLoadingResults = false;
        this.alertService.showSuccessAlert('Post editado com sucesso.');

      },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível editar post.');
      }
    })
  }
// CAPRICHOSO TETRA
  editPostStorage(data: PostInterface): void {
    const updateList = this.posts.map((post: PostInterface) => post.id === data.id ? data : post)
    this.storageService.saveToStorage('posts', JSON.stringify(updateList));
    this.listPostsStorage();
  }

  deletePost(index: any): void {
    this.isLoadingResults = true;
    this.postsService.deletePost(index).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.alertService.showSuccessAlert('Post deletado.');
        this.deletePostStorage(index);
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível deletar post.');
      }
    })
  }

  deletePostStorage(postId: number): void {
    const index = this.posts.findIndex(post => post.id === postId);
    if (index !== -1) {
      this.posts.splice(index, 1);
      this.storageService.saveToStorage('posts', JSON.stringify(this.posts));
      this.listPostsStorage();
    }
  }

  showDialogPost(isEdit: boolean, post?: any): void {
    this.isEdit = isEdit
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

  onSelectPost(post: any): void {
    this.selectedPost = post;
    console.log(post)
    this.openDrawer.set(!this.openDrawer());
  }

  onAddComment(): void {
    this.addComment = true;
    setTimeout(() => {
      this.addComment = false;
    });
  }

}
