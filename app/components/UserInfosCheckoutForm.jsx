  function UserInfosCheckoutForm({errors, register}){
    
  return (
  <form className="w-full text-[var(--black)] text-xs">
    <div className='my-4'>
      <h2 className='mb-2 uppercase'>Contact</h2>
      <div className="mb-2 relative">
      <label 
      htmlFor="email" 
      className="absolute top-1 left-[9px] text-[12px]"
      >Email</label>
      <input
      id="email"
      type='email'
      {...register('email', { required: 'Email is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
      
    />
    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
  </div>
  <div className="mb-2 flex space-x-2">
    <div className="w-1/2 min-h-3 relative">
      <label htmlFor="firstname" className="absolute top-[7px] left-[9px] text-[12px]">First name</label>
      <input
        id="firstname"
        {...register('firstname', { required:'First name is required' })}
        className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
        
        />
      {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>}
    </div>
    <div className="w-1/2 relative">
      <label htmlFor="lastname" className="absolute top-[7px] left-[9px] text-[12px]">Last name</label>
      <input
        id="lastname"
        {...register('lastname', { required: 'Last name is required' })}
        className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
      />
      {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
    </div>
  </div>
  </div>
  <h2 className='mb-2 uppercase'>Address</h2>
  
  <div className="mb-2 relative">
    <label htmlFor="Country" className="absolute top-1 left-[9px] text-[12px]">Country</label>
    <input
      id="country"
      {...register('country', { required: 'Country is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
      
    />
    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
  </div>
  <div className="mb-2 relative">
    <label htmlFor="address" className="absolute top-1 left-[9px] text-[12px]">Street</label>
    <input
      id="street"
      {...register('street', { required: 'Street is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
      
    />
    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
  </div>

  <div className="mb-2 flex space-x-2">
    <div className="w-1/2 relative">
      <label htmlFor="city" className="absolute top-[7px]  left-[9px] text-[12px]">City</label>
      <input
        id="city"
        {...register('city', { required: 'City is required' })}
        className="px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
        
      />
      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
    </div>
    <div className="w-1/2 relative">
      <label htmlFor="postcode" className="absolute top-[7px]  left-[9px] text-[12px]">Postcode</label>
      <input
        id="postcode"
        {...register('postcode', { required: 'Postecode is required' })}
        className="px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
        

      />
      {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode.message}</p>}
    </div>
  </div>
  <div className="mb-2 relative">
    <label htmlFor="phone" className="absolute top-1 left-[9px] text-[12px]">Phone number</label>
    <input
      id="phone"
      type="phone"
      {...register('phone', { required: 'Phone number is required' })}
      className="mt-1 px-2 pt-[20px] pb-[6px] block w-full border border-[var(--black)] bg-[var(--dark-gray)] text-[12px]"
      
    />
    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
  </div>
</form>
  );
}

export default UserInfosCheckoutForm;
