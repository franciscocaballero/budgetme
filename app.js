//*********************/BUDGET CONTROLLER*****************************/
//********************************************************************

let budgetController = (function () {

    //some code 
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID ;

            //[1 2 3 4 5 ], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last IID + 1 

            //Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;

            } else {
                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        testing: function() {
            console.log(data)
        }
    };

})();

let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};



//*********************/UI CONTROLLER/*******************************
//******************************************************************* 
let UIController = (function () {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'

    }
    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be ether inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMStrings: function () {
            return DOMstrings;
        },

        testing: function() {
            console.log(data);
        }
    }

})();



//*********************/GLOBAL APP CONTROLLER/*******************************
//******************************************************************* 
let controller = (function (budgetCtrl, UICtrl) {

let setupEventListeners = function() {
    let DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        };
    

        let ctrlAddItem = function () {
            let input, newItem;
            // 1. Get the field input data 

            input = UICtrl.getInput();
            console.log(input);
            // 2. Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI

            // 4. Calculate the budget 

            // 5. Display the budget on the UI
        };

        return {
            init: function() {
                console.log('Application has started!');
                setupEventListeners();
            }
        };




})(budgetController, UIController);


controller.init();