import fire from '../../config/Fire';
import React from 'react';
import Transaction from '../Tracker/Transaction/Transaction';
import '../Tracker/Tracker.css';
import { Link } from 'react-router-dom';
class Report extends React.Component{

    
    state = {
        transactions: [],
        money: 0,

        transactionName: '',
        transactionType: '',
        price: '',
        date:'',
        month:'',
        currentUID: fire.auth().currentUser.uid
    }
    componentWillMount() {


    const { currentUID, money } = this.state;
    let totalMoney = money;
    const BackUpState = this.state.transactions;
    fire.database().ref('Transactions/' + currentUID).once('value',
        (snapshot) => {
            // console.log(snapshot);
            snapshot.forEach((childSnapshot) => {

                totalMoney =
                    childSnapshot.val().type === 'deposit' ?
                        parseFloat(childSnapshot.val().price) + totalMoney
                        : totalMoney - parseFloat(childSnapshot.val().price);

                BackUpState.push({
                    id: childSnapshot.val().id,
                    name: childSnapshot.val().name,
                    type: childSnapshot.val().type,
                    price: childSnapshot.val().price,
                    date: childSnapshot.val().date,
                    user_id: childSnapshot.val().user_id
                });
                 
            });
            this.setState({
                transactions: BackUpState,
                money: totalMoney
            });
        });
    }
    render(){
        return(
           
            <div className="latestTransactions" >
            <Link to='/'>
            <button className="addTransaction">Back</button>
             </Link>
            <p>Latest Transactions</p>
            <ul>
            <p>
            Transaction Name  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             &nbsp;&nbsp;&nbsp;Transactions
           
            </p>
                {
                    Object.keys(this.state.transactions).map((id) => (
                        <Transaction key={id}
                            type={this.state.transactions[id].type}
                            name={this.state.transactions[id].name}
                            date={this.state.transactions[id].date}
                            price={this.state.transactions[id].price}

                        />
                    ))
                }
            </ul>
        </div >
        );
    }
}
  
  export default Report;