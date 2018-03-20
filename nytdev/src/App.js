import React, { Component } from 'react';
import $ from 'jquery';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

   constructor(props){    
      super(props);    
      this.state = {
      'docs': [] ,
        'selectedArticle':{
          headline: {
            main:""
          },
        'pub_date':"",
        'snippet': "",
        }
      };    
      this.onSuccess = this.onSuccess.bind(this); 
      this.handleArticleClick = this.handleArticleClick.bind(this);
      
    }

  

    onSuccess(responseData) { 
      let docs = [];    
      for(var i = 0; i < 20; i++) {      
        const doc = responseData.response.docs[i];      
        docs.push(doc);    
    }       
      this.setState({'docs': docs});  
  }

    componentDidMount(){  
    var url = "https://api.nytimes.com/svc/archive/v1/2016/1.json";
    
      $.ajax({     
        url: url,       
        method: 'GET',       
        data: {           
          'q_year': document.getElementById('year').value,
          'q_month': document.getElementById('month').value,
          'api-key': "581847de71484ddba4e5ae5eee1b92e4",   
       },       
      success: this.onSuccess    
     });  
  }

  handleArticleClick(item){
    console.log(JSON.stringify(item));
    this.setState({selectedArticle: item})
   }

  render(){    
      return (
        <div class="flex-container" id="page">
          <Results docs={this.state.docs} selectionHandler={this.handleArticleClick}/>
          <ArticleDetails article={this.state.selectedArticle}/>
        </div>
      );
    }

}



function Results(props){  
  return (
    
    <div class="grid-container" id="master">    
      {
        props.docs.map((doc) => <ArticlePreview selectionHandler={props.selectionHandler} key={doc.webUrl} className="article" webUrl={doc.webUrl} doc={doc} />)
      }     
    </div>
    
  );
}


function ArticleDetails(props){
    return (
        <div className="details">
          <p>Details of selected article</p>
          <p>{props.article.headline.main}</p>
          <p>{props.article.pub_date}</p>
          <p>{props.article.snippet}</p>
        </div>
    );
}

class ArticlePreview extends React.Component {
    
  constructor(props){
    super(props)
    this.state={
      'data': {
          
          'description': "",
          'image': "",
          'title': "",

         }
    }
    this.onSuccess = this.onSuccess.bind(this)
  }

  onSuccess(answer){

        this.setState({data: answer});
           
    console.log(answer);
  }


    componentDidMount(){
       $.ajax({
          //url: 'https://api.linkpreview.net',
          url: "https://api.linkpreview.net?key=123456&q=https://www.google.com",
          dataType: 'jsonp',
          method: 'GET',
          // data: {
          //     'key': "5a915cd51a38ad77da5d9698f24ff9055107e7a053d34",
          //     'q': this.props.webUrl
          // },
          success: this.onSuccess
      });
    }
    
    render(){
        return  (
            <div className="article" class="grid-item" onClick={() => this.props.selectionHandler(this.props.doc)}>  
                <p>{this.state.data.description}</p>
                <img src={this.state.data.image}/>
                 <h3>{this.state.data.title}</h3>
            </div>
        );
    }
} 

export default App;
