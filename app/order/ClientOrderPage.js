'use client';

import { useEffect } from 'react';

const ClientOrderPage = () => {

    useEffect(() => {
        localStorage.removeItem('cart'); 
    }, []); 

    return (
        <div>
            
        </div>
    )
}

export default ClientOrderPage
