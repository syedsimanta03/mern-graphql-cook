import React from 'react'
import { HashLoader } from 'react-spinners';


const Spinner = () => {
  return (
    <div className='spinner'>
      <HashLoader color={'#dbab0f'} size={90} margin={'3px'} />
    </div>
  );
}

export default Spinner
