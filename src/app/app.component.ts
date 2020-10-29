import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { queryAll, queryOne } from './graphql/queries.graphql';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: any = 'Todo App';
  titleRainbow = [
    'text-primary',
    'text-secondary',
    'text-success',
    'text-danger',
    'text-warning',
    'text-info',
    'text-light'
  ]
  constructor(private apollo: Apollo) {

  }

  getTextColor = (index) => {
    return this.titleRainbow[index] ? this.titleRainbow[index] : this.titleRainbow[Math.ceil(index - index / 2)]
  }

  ngOnInit() {
    this.title = this.title.split('')
      .map((e, i) => {
        return {
          name: e,
          color: this.getTextColor(i)
        };
      })
    // console.log(this.title)
  }
}
