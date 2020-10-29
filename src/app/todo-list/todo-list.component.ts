import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, of, } from 'rxjs'
import { filter, map } from 'rxjs/operators';
import { createTask } from '../graphql/mutation.graphql';
import { queryAll } from '../graphql/queries.graphql';
import { TodoService } from '../services/todo.service';

interface TodoState {
  data?: any;
  errors?: any;
  loading?: boolean;
  error?: any;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  items: Observable<any>;
  state: TodoState = {
    data: {},
    errors: null,
    loading: false,
    error: null
  }

  createFrom : FormGroup;

  textLength = 70;

  keyword = '';

  notifications = [];

  expandItems = [];

  constructor(private todoService: TodoService, private apollo: Apollo) {
    this.createFrom = new FormGroup({
      name : new FormControl('',Validators.required),
      description : new FormControl('')
    })
    // console.log(this.createFrom.invalid)
   }

  //variable newState = this.state , because this is initial state of component, 
  // you can change iu by passing params here
  setState = (newState: TodoState = this.state) => {
    this.state = { ...this.state, ...newState }
  }

  onSubmit(e) {
    e.preventDefault();
    // console.log(this.createFrom.value)
    this.createTask(this.createFrom.value);
    this.createFrom.reset();
  }

  ngOnInit(): void {

    //Lazy loading component when the data is not retrived 
    this.setState({
      loading: true
    });

    //initialize component , first resolving 🙌

    this.items = this.apollo.watchQuery({
      query: queryAll,
    }).valueChanges.pipe(
      map(result => {
        const { data, loading } = result;
        const mapExpanStatus = data['items'].map(e => ({ ...e, isExpan: false }));
        // console.log(mapExpanStatus)
        this.expandItems = mapExpanStatus;
        this.setState({
          loading, data
        });
        return mapExpanStatus;
      })
    )
  }


  createTask = ({name,description}) => {
    // console.log(name,description)
    this.todoService.createTask(name,description).then()

  }

  transition = (id) => setTimeout(() => {
    // console.log(id)
    this.items = this.items.pipe(
      map(r => {
        this.expandItems = r.map(res => {
          return res.id === id ?
            { ...res, isExpan: !res.isExpan } :
            res
        });
        return r.map(res => {
          return res.id === id ?
            { ...res, isExpan: !res.isExpan } :
            res
        });
      }),
    )
  }, 150);

  onChange = (value) => {
    if(value !== '') {
      this.items = this.items.pipe(
        map(res => res.filter(item => item.name.toLowerCase().includes(value.toLowerCase())))
      )
    }
    else {
      this.items = of(this.expandItems)
    }
  }

  waitASeconds = (cb, second?: number) => setTimeout(() => cb(), second || 1500)

  getSmallDecription = (text: string) => {
    return text.substr(0, this.textLength) + "...";
  }

  refreshList = () => {
    
    this.items = this.apollo.watchQuery({
      query: queryAll,
    }).valueChanges.pipe(
      map(result => {
        const { data, loading } = result;
        const mapExpanStatus = data['items'].map(e => ({ ...e, isExpan: false }));
        // console.log(mapExpanStatus)
        this.expandItems = mapExpanStatus;
        this.setState({
          loading, data
        });
        return mapExpanStatus;
      })
    )
  }

  notificationHandler = (data) => {
    this.waitASeconds(() => this.notifications.push({
      messageObj: data.deleteItem
    }))
    this.waitASeconds(() => this.notifications.shift());
  }

  toggleCompleteTask = (id, Itemstatus) => {
    console.log(id)
    this.todoService.completeTask(id, !Itemstatus).then(res => {
      this.waitASeconds(() => this.refreshList(),200)
    })
  }

  deleteTask = (id: string) => {
    // console.log(id)
    this.setState({ loading: true })
    this.todoService.deleteOne(id).then(res => {
      this.setState({ loading: false })
    })
  }



}
