import React from 'react'

const Photos = () => {
  return (
    <div className='bg-white dark:bg-[#262829] p-5 rounded-lg mt-2 md:mt-5'>
      <h1 className='font-semibold text-xl mb-5'> Photos</h1>
      <div className='grid grid-cols-3 gap-1 rounded-2xl'>
        {
          posts?.map((post)=>{
            return <img key={post._id} src={post.image} alt="" className='aspect-square rounded-lg'/>
          })
        }
      </div>
    </div>
  )
}

export default Photos
