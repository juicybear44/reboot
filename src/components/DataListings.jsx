// import React from 'react'

import DataListing from './DataListing';

import jobs from '../jobs.json';


const DataListings = () => {
    return (
     <section className='bg-amber-300 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-yellow-50 mb-6 text-center'>
        Hello this is a job listing
        </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {jobs.jobs.map((job) => (
                <DataListing key={job.id} job={job}/>
            ))}
          </div>
      </div>
    </section>
  );
};

export default DataListings