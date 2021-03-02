import {MongoClient} from 'mongodb';

const assert = require('assert')
const json = require('./result.json');

// console.log(JSON.parse(json));
// console.log(json);

MongoClient.connect('mongodb://127.0.0.1:27017/amazon', (err, client) => {
	// assert(false, err);
	console.log("Connected successfully to server");
	insertDocuments(client, json, (result) => {
		console.log(result);
	});

	client.close();
});

const insertDocuments = (client: MongoClient, json, callback) => {
	const db = client.db('amazon');
	const collection = db.collection<"books">('books');
	collection.findOne({},{}, (data)=>{
		console.log(data);
	});

	// collection.insertMany(json,function(e,docs){
	// 	console.log(e);
	// 	console.log(docs);
	// });
	// db.books.insert(json[0], (err, result) => {
	//
	// 	callback(result)
	// });
};