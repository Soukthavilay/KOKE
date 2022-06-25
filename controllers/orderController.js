'use strict'
const firebase = require('../db');
const Order = require('../models/order');
//const Orderitem = require('../models/order_item');
const fs = require('firebase-admin');
const firestore = fs.firestore();

//add order
const addOrder= async(req, res,next) => {
    try{
        const ordername = req.body.name;
        const data = req.body;
        data.created_at = new Date(Date.now()).toDateString();
        await firestore.collection('orders').doc().set(data);
        const r = await firestore.collection('orders').where("name","==",ordername).get()
        .then((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            return data[0]
        }
        )   
        return res.status(200).json({order : r});
    }catch (error){
        return res.status(404).send(error.message);
    }
}
// get all order
const getAllOrder = async(req, res,next) => {
    try {
        const orders = await firestore.collection('orders');
        const data = await orders.get();
        const ordersArray = [];
        if(data.empty){
            res.status(404).send('No have order record found');
        }else{
            data.forEach(doc =>{
                const order = new Order(
                    doc.id,
                    doc.data().created_at,
                    doc.data().modified_at,
                    doc.data().amount,
                    doc.data().status,
                    doc.data().name,
                    doc.data().address,
                    doc.data().userId,
                    doc.data().mobile
                );
          // get orderItem by OrderId
          //      ordersArray.pust({order : order, orderItem : orderItem })
                ordersArray.push(order);
            });
            res.send(ordersArray);
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
}
// get on order
const getOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const orders = await firestore.collection('orders').doc(id);
        const data = await orders.get();
        if(!data.exists){
            res.status(404).send('order with the given Id not found');
        }else{
            res.send(data.data());
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
}
// update 
const updateOrder = async(req, res,next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const ordername = req.body.name;
        data.modified_at = new Date(Date.now()).toDateString();
        const orders = await firestore.collection('orders').doc(id);
        await orders.update(data);
        await firestore.collection('orders').doc().set(data);
        const r = await firestore.collection('orders').where("name","==",ordername).get()
        .then((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            return data[0]
        }
        )   
        return res.status(200).json({order : r});
    } catch (error) {
        res.status(404).send(error.message);
    }
}
// delete
const deleteOrder = async (req, res,next) =>{
    try {
        const id = req.params.id;
        const orders = await firestore.collection('orders').doc(id).delete();
        res.send('Delete xong r ba noi');
    } catch (error) {
        res.status(404).send(error.message);
    }
}
module.exports ={
    addOrder,
    getAllOrder,
    getOrder,
    updateOrder,
    deleteOrder
}

// get orderItem by OrderId
// get Order by userId