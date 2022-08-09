import React from 'react';
import { Link } from 'react-router-dom';
class Create extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {name: '', price:'', sale_price:'', sales_count:'', sale_date:''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
      const state = this.state
      state[event.target.name] = event.target.value
      this.setState(state);
  }
  
  handleSubmit(event) {
      event.preventDefault();
      fetch('http://localhost:8080/product', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                price: this.state.price,
                sale_price: this.state.sale_price,
                sales_count: this.state.sales_count,
                sale_date: this.state.sale_date
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => {
                if(response.status === 201) {
                    alert("New product saved successfully");
                }
            });
  }
  
  render() {
    return (
        <div id="container">
          <Link to="/">Products</Link>
              <p/>
              <form onSubmit={this.handleSubmit}>
                <p>
                    <label>Name:</label>
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
                </p>
                <p>
                    <label>Price:</label>
                    <input type="text" name="price" value={this.state.price} onChange={this.handleChange} placeholder="Price" />
                </p>
                <p>
                    <label>Selling Price:</label>
                    <input type="text" name="sale_price" value={this.state.sale_price} onChange={this.handleChange} placeholder="Selling Price" />
                </p>
                <p>
                    <label>Sales Count:</label>
                    <input type="text" name="sales_count" value={this.state.sales_count} onChange={this.handleChange} placeholder="Sales Count" />
                </p>
                <p>
                    <label>Sale Date:</label>
                    <input type="text" name="sale_date" value={this.state.sale_date} onChange={this.handleChange} placeholder="Sale Date" />
                </p>
                <p>
                    <input type="submit" value="Submit" />
                </p>
              </form>
           </div>
    );
  }
}
export default Create;