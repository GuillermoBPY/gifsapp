import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];
  private apikey: string = 'mN8jYWVjMRzrJkoADQACjw4buEyPZVsV';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  private _tagsHistory: string[] = [];
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }
  get tagsHistory() {
    return [...this._tagsHistory];
  }
  private organizedHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldtag) => oldtag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    let temporal = JSON.parse(localStorage.getItem('history')!);
    this._tagsHistory = temporal;
    this.searchTag(temporal[0]);
  }
  searchTag(tag: string): void {
    if (!tag) return;
    this.organizedHistory(tag);
    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('limit', 12)
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
        console.log({ gifs: this.gifList });
      });
  }
}
