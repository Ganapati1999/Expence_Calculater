import React from 'react';

const Transaction = props => {
    return (
        

        <tr>
          <td>  
            <div>{props.name}</div>
         </td>
          <td>
           <div>{props.date}</div> 
        </td>
         <td>
            <div>{props.type === 'deposit' ? (
                <span className="deposit">+{props.price} </span>
            ) : (
                <span className="expense">
                    -{props.price}
                </span>
            )}</div>
             </td>
            <td>
            <div>{props.note}</div> 
            </td>
         
         </tr>
    );
}

export default Transaction;