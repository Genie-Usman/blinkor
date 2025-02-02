import React from 'react'

const Product = async ({ params }) => {
    const { slug } = await params;

    return (
        <div>
            <h1 className='bg-slate-500'>Product: {slug}</h1>
        </div>
    );
}


export default Product