import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class WordSuggestionService {

  constructor(private http: HttpClient) {}

  // Method to fetch word suggestions based on user input
  getSuggestions(query: string): Observable<string[]> {
    return this.http.get<any[]>(`https://api.datamuse.com/words?sp=${query}*`).pipe(
      map((response) => response.map((item) => item.word))
    );
  }
  
}
