import { inject, Injectable } from '@angular/core';
import { CommentInterface } from '../interface/CommentInterface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http: HttpClient = inject(HttpClient);

constructor() { }

  getCommentsInPost(postId: number): Observable<CommentInterface[]> {
    return this.http.get<CommentInterface[]>(`${environment.url}/posts/${postId}/comments`);
  }

    createComment(comment: CommentInterface): Observable<CommentInterface> {
    return this.http.post<CommentInterface>(`${environment.url}/comments/`, comment);
  }

    patchComment(comment: CommentInterface): Observable<CommentInterface> {
    return this.http.patch<CommentInterface>(`${environment.url}/comments/${comment.id}`, comment);
  }

    putComment(comment: CommentInterface): Observable<CommentInterface> {
    return this.http.put<CommentInterface>(`${environment.url}/comments/${comment.id}`, comment);
  }

   deleteComment(id: number): Observable<CommentInterface> {
    return this.http.delete<CommentInterface>(`${environment.url}/comments/${id}`);
  }
}
