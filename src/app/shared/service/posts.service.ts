import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePostInterface, PostInterface } from '../interface/PostInterface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private http: HttpClient = inject(HttpClient);

  getAllPosts(): Observable<PostInterface[]> {
    return this.http.get<PostInterface[]>(`${environment.url}/posts`);
  }

  getPostById(id: number): Observable<PostInterface> {
    return this.http.get<PostInterface>(`${environment.url}/posts/${id}`);
  }

    createPost(post: CreatePostInterface): Observable<PostInterface> {
    return this.http.post<PostInterface>(`${environment.url}/posts/`, post);
  }

    patchPost(post: PostInterface): Observable<PostInterface> {
    return this.http.patch<PostInterface>(`${environment.url}/posts//${post.id}`, post);
  }

    putPost(post: PostInterface): Observable<PostInterface> {
    return this.http.put<PostInterface>(`${environment.url}/posts/${post.id}`, post);
  }

   deletePost(id: number): Observable<PostInterface> {
    return this.http.delete<PostInterface>(`${environment.url}/posts/${id}`);
  }
}
