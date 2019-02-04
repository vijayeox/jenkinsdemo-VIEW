
import React from 'react';

const AddContactForm = ({onInputChange, onFormSubmit}) => 
	(
		<form>
			
			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">Group Name</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="xyz" />
			</div>
			
			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">Parent Group</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="xyz" />
			</div>
			
			  <div className="form-group">
			    <label htmlFor="phoneNumber">Organisation ID</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="111" />
			 </div> 
			  
			  <div className="form-group">
			    <label htmlFor="phoneNumber">Manager ID</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="123" />
			 </div> 
			 
			 <div className="form-group">
			    <label htmlFor="physicalAddress">Description</label>
			    <textarea className="form-control" name="address" onChange={onInputChange} rows="3"></textarea>
			</div>
			
			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">Status</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="xyz" />
			</div>
			<button type="submit" onClick={onFormSubmit} class="btn btn-primary"> Submit </button>
	    </form>
		)

export default AddContactForm;