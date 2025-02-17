'use client';

import { useEffect } from 'react';

const ClientOrderPage = () => {

    useEffect(() => {
        localStorage.removeItem('cart'); 
    }, []); 

    return (
        <>
        </>
    )
}

export default ClientOrderPage
