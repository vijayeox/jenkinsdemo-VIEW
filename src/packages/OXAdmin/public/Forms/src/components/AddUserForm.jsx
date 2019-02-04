
import React from 'react';

const AddContactForm = ({onInputChange, onFormSubmit}) => 
	(
		<form>
			
			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">First Name</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="Shane" />
			</div>
			
			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">Last Name</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="Richard" />
			</div>
			
			<div className="form-group">
			    <label htmlFor="phoneNumber">Contact Number</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="+1 1234567890" />
			 </div> 
			 
			 <div className="form-group">
			    <label htmlFor="physicalAddress">Address</label>
			    <textarea className="form-control" name="address" onChange={onInputChange} rows="3"></textarea>
			</div>
			
			<div className="form-group">
			    <label htmlFor="phoneNumber">Phone Number</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="011-252011" />
			 </div> 
			
			 <div className="form-group class-sm-3">
			    <label htmlFor="fullName">Designation</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="Developer" />
			</div>

			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">DOB</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="dd/mm/yyyy" />
			</div>
			
			<div className="form-group class-sm-3">
			    <label htmlFor="fullName">Date of join</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="dd/mm/yyyy" />
			</div>
			

			<div className="form-group">
			    <label htmlFor="phoneNumber">Manager ID</label>
			    <input type="number" class="form-control" name="phone" onChange={onInputChange} placeholder="00765" />
			 </div> 
			
			 <div className="form-group class-sm-3">
			    <label htmlFor="fullName">Country</label>
			    <input type="name" class="form-control" name="name" onChange={onInputChange} placeholder="India" />
			</div>
			
			<div className="form-group">
			    <label htmlFor="physicalAddress">Description</label>
			    <textarea className="form-control" name="address" onChange={onInputChange} rows="3"></textarea>
			</div>
			
			
			
			
			
			 
			 
			

			<button type="submit" onClick={onFormSubmit} class="btn btn-primary"> Submit </button>
		</form>
	)

export default AddContactForm;