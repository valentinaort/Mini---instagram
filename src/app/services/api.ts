import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://IP_DE_LA_PI/api'; // Cambia esto por tu IP

  constructor(private http: HttpClient) {}

  // Obtener headers con token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  // Autenticación
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { 
      headers: this.getHeaders() 
    });
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`, { 
      headers: this.getHeaders() 
    });
  }

  // Publicaciones
  getPosts(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts?page=${page}`, { 
      headers: this.getHeaders() 
    });
  }

  createPost(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/posts`, formData, { headers });
  }

  getPost(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Comentarios
  getComments(postId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/posts/${postId}/comments`, { 
      headers: this.getHeaders() 
    });
  }

  createComment(postId: number, content: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/comments`, 
      { content }, 
      { headers: this.getHeaders() }
    );
  }

  // Likes
  likePost(postId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts/${postId}/like`, {}, { 
      headers: this.getHeaders() 
    });
  }

  unlikePost(postId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/posts/${postId}/like`, { 
      headers: this.getHeaders() 
    });
  }

  // Amigos
  sendFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/${userId}/friend`, {}, { 
      headers: this.getHeaders() 
    });
  }

  getFriends(): Observable<any> {
    return this.http.get(`${this.baseUrl}/friends`, { 
      headers: this.getHeaders() 
    });
  }

  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.baseUrl}/friendships/pending`, { 
      headers: this.getHeaders() 
    });
  }

  acceptFriendRequest(friendshipId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/friendships/${friendshipId}/accept`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }
}