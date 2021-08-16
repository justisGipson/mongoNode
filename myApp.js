const mySecret = process.env['MONGO_URI']
const mongoose = require('mongoose')
const mongodb = require('mongodb')

// mongoose.set('useFindAndModify', false);

const { Schema } = mongoose
require('dotenv').config();

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new Schema({
  name: {type: String, required: true},
  age: Number,
  favoriteFoods: [String]
})

let Person = mongoose.model('Person', personSchema)

const createAndSavePerson = (done) => {
  var dave = new Person({
    name: "dave",
    age: 35,
    favoriteFoods: [
      "pizza",
      "pasta",
      "beer"
    ]
  })

  dave.save((err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })
};

let arrayOfPeople = [
  {name: "paul", age: "24", favoriteFoods: ["spice"]},
  {name: "leto", age: "50", favoriteFoods: ["nothing"]},
  {name: "duke", age: "40", favoriteFoods: ["pizza"]}
]

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, personFound) => {
    if (err) return console.error(err)
    done(null, personFound)
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err)

    person.favoriteFoods.push(foodToAdd)

    person.save((err, updatedPerson) => {
      if (err) return console.error(err)
      done(null, updatedPerson)
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedPerson) => {
    if (err) console.error(err)
    done(null, updatedPerson)
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return console.error(err)
    done(null, removedPerson)
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.deleteMany({name: nameToRemove}, (err, res) => {
    if (err) return console.error(err)
    done(null, res)
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch}, (err, data) => {
    if (err) {
      return console.error(err)
    } else {
      done(null, data)
    }
  }).sort({name: 'asc'}).limit(2).select('-age').exec()
};

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
