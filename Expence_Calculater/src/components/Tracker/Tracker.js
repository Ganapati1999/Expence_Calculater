import React, { Component } from 'react';
import './Tracker.css';
import fire from '../../config/Fire';
import Transaction from './Transaction/Transaction';


class Tracker extends Component {

    state = {
        transactions: [],
        money: 0,

        transactionName: '',
        transactionType: '',
        price: '',
        date: '',
        note: '',
        currentUID: fire.auth().currentUser.uid

    }

    // logout function
    logout = () => {
        fire.auth().signOut();
    }




    handleChange = input => e => {
        this.setState({

            [input]: e.target.value !== "0" ? e.target.value : "",

        });
    }



    // add transaction
    addNewTransaction = () => {




        // const date = new Date();
        // const d1 = date.getDate().toString()
        // const d2 = (date.getMonth() + 1).toString()
        // const d3 = date.getFullYear().toString()
        // const d4 = date.getHours().toString()
        // const d5 = date.getMinutes().toString()
        // const d = "" + d1 + "/" + d2 + "/" + d3 + "  AT " + d4 + ":" + d5 + " ";


        const { transactionName, transactionType, price, currentUID, money, date, note } = this.state;

        // validation
        if (transactionName && transactionType && price) {



            // const d=new Date(date)
            // const  d1=d.getMonth()+1;
            // console.log(d1);
            if (money < parseFloat(price) && transactionType !== 'deposit') {
                alert("insufficient Balance");
            }

            else {


                const BackUpState = this.state.transactions;
                BackUpState.push({
                    id: BackUpState.length + 1,
                    name: transactionName,
                    type: transactionType,
                    price: price,
                    user_id: currentUID,
                    date: date,
                    note: note,
                });

                fire.database().ref('Transactions/' + currentUID).push({
                    id: BackUpState.length,
                    name: transactionName,
                    type: transactionType,
                    price: price,
                    user_id: currentUID,
                    date: date,
                    note: note,
                }).then((data) => {
                    //success callback
                    console.log('success callback');
                    this.setState({
                        transactions: BackUpState,
                        money: transactionType === 'deposit' ? money + parseFloat(price) : money - parseFloat(price),

                        transactionName: '',
                        transactionType: '',
                        price: '',
                        note: ''
                    })
                }).catch((error) => {
                    //error callback
                    console.log('error ', error)
                });
            }


        }
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
                        user_id: childSnapshot.val().user_id,
                        note: childSnapshot.val().note
                    });
                    // console.log(childSnapshot.val().name);
                });
                this.setState({
                    transactions: BackUpState,
                    money: totalMoney
                });
            });
    }


    render() {
        var currentUser = fire.auth().currentUser;
        return (
            <div className="trackerBlock">
                <div className="welcome">
                    <span>Hi, {currentUser.displayName}!</span>
                    <button className="exit" onClick={this.logout}>Exit</button>
                </div>

                <div className="totalMoney">${this.state.money}</div>

                <div className="newTransactionBlock">
                    <div className="newTransaction">
                        <form>
                            <input
                                onChange={this.handleChange('transactionName')}
                                value={this.state.transactionName}
                                placeholder="Transaction Name"
                                type="text"
                                name="transactionName"
                            />
                            <div className="inputGroup">
                                <select name="type"
                                    onChange={this.handleChange('transactionType')}
                                    value={this.state.transactionType}>
                                    <option value="0">Type</option>
                                    <option value="expense">Expense</option>
                                    <option value="deposit">Deposit</option>
                                </select>
                                <input
                                    onChange={this.handleChange('price')}
                                    value={this.state.price}
                                    placeholder="Price"
                                    type="text"

                                    name="price"
                                />
                                <textarea rows="3" cols="100"
                                    onChange={this.handleChange('note')}
                                    value={this.state.note}
                                    type="textarea" name="note" 
                                    placeholder='Enter your Note Here'>
                                    

                                   
                                </textarea>

                                <input
                                    onChange={this.handleChange('date')}
                                    value={this.state.date}
                                    placeholder="Date"
                                    type="Date"
                                    name="date"
                                />
                            </div>
                        </form>
                        <button onClick={() => this.addNewTransaction()} className="addTransaction">+ Add Transaction</button>



                    </div>
                    <div className="latestTransactions" >

                        <p>Latest Transactions</p>
                        <table>
                             <tr>
                                 <th>Name Of Transactions</th>
                                 <th>Date of Transaction</th>
                                 <th>Price(Debited/Credited)</th>
                                 <th>Note</th>

                             </tr>
                            {/* <div className='Align'>
                                Transaction Name &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                                Date   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                Transactions

                            </div> */}
                            {
                                Object.keys(this.state.transactions).map((id) => (
                                    <Transaction key={id}
                                        type={this.state.transactions[id].type}
                                        name={this.state.transactions[id].name}
                                        date={this.state.transactions[id].date}
                                        price={this.state.transactions[id].price}
                                        note={this.state.transactions[id].note}

                                    />
                                ))
                            }
                            
                        </table>
                    </div >
                </div>

            </div>
        );
    }
}

export default Tracker;