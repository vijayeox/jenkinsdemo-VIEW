
import React from 'react';

const AddContactForm = ({onInputChange, onFormSubmit}) => 
	(
		<form>
			
			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">Organisation Name</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="VANTAGE AGORA" />
			</div>
			
			<div className="form-group">
			    <label htmlFor="phoneNumber">Organisation Id</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="VA:000" />
			 </div> 

			
		    <div className="form-group class-sm-3">
			    <label htmlFor="fullName">Manager Name</label>
			    <input type="name" class="form-control" name="surname" onChange={onInputChange} placeholder="Bob" />
			</div>
			
			 <div className="form-group">
			    <label htmlFor="phoneNumber">Organisation  ID</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="VA:000" />
			 </div> 

			
			<div className="form-group">
			    <label htmlFor="phoneNumber">Contact Number</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="+1 1234567890" />
			 </div> 
			 
			 <div className="form-group">
			    <label htmlFor="emailAddress">Email address</label>
			    <input type="email" class="form-control" name="email" onChange={onInputChange} placeholder="name@example.com" />
			</div>
			
			<div className="form-group">
			    <label htmlFor="physicalAddress">Address</label>
			    <textarea className="form-control" name="address" onChange={onInputChange} rows="3"></textarea>
			</div>

			<button type="submit" onClick={onFormSubmit} class="btn btn-primary"> Submit </button>
		</form>
	)

export default AddContactForm;