import React ,{Component}from 'react';
import './App.css';
const Exercise = props => (
  <tr>
    <td>{props.exercise.Drug_Name}</td>
    <td>{props.exercise.Price}</td>
    <td>{props.exercise.real_price}</td>
    {/* <td>{props.exercise.date.substring(0,10)}</td> */}
     {<td>
      <Link to={"/edit/"+props.exercise._id}>Buy</Link> 
    </td> }
  </tr>
)
export const AuthMenuList = props => {
  return [
    <li>Home</li>
    // <li>About</li>,
    // <li>Contact Us</li>,
    // <li>Logout</li>
  ];
};

class App extends Component{

   constructor(props){

    super(props);

    this.onChangeQuery = this.onChangeQuery.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.searchResults = this.searchResults.bind(this);

    this.state = {
      query: '',
      showResults: false,
       results: []
    }

   }
   onChangeQuery(e) {
    this.setState({
      query: e.target.value
    })
  }
   async onSubmit(e) {
    //this.searchResults();
    e.preventDefault();

    const requestOptions = {
      method: 'GET',
  };

  console.log(this.state.query);
  const k=await fetch('http://localhost:5001/'+this.state.query,requestOptions);
 // .then(response => { console.log(response.json())});
  var body=await k.json();
  console.log("Body "+ body[0].Price);
      this.setState({
        showResults:true,
        results:body
        
      });
     // this.searchResults();
   // console.log(query + " d as");

    
  }
  searchResults () {
      //console.log("Search ");//+body[0].get("Price"));
      return this.state.results.map(currentexercise => {
        return <Exercise exercise={currentexercise}  key={currentexercise.Price}/>;
      })
    }
      // return this.state.exercises.map(currentexercise => {
      //   return <Exercise exercise={currentexercise} />
      // })
          
  
     
   render() {
     
    return (
      <div>
        <h3>Search Medicine</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group"> 
            <label>Medicine Name: </label>
            <input  type="text"
                required
                className="form-control"
                value={this.state.query}
                onChange={this.onChangeQuery}
                />
          </div>
          <div className="form-group">
            <input type="submit" value="Search" className="btn btn-primary" />
          </div>
        </form>
         {this.state.showResults && <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>MRP</th>
              <th>Discount Price</th>
              <th>Link</th>             
              {/* <th>Date</th>
              <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            { this.searchResults() }
          </tbody>
        </table>}
        
      </div>

    )
  }
}

export default App;
