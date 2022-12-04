import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'



function Comment(props) {
    const { store } = useContext(GlobalStoreContext);
    const { comment, index } = props;

    return (
        <div>
            {comment}
        </div>




    );

}

export default Commment;