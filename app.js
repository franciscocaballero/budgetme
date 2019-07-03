//BUDGET CONTROLLER
let budgetController = (function () {

    //some code 

})();

//UI CONTROLLER
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
        }
    }

})();

// GLOBAL APP CONTROLLER  
let controller = (function (budgetCtrl, UICtrl) {

    let DOM = UICtrl.getDOMStrings();

    let ctrlAddItem = function () {

        // 1. Get the field input data 

        let input = UICtrl.getInput();
        console.log(input);
        // 2. Add the item to the budget controller.

        // 3. Add the item to the UI

        // 4. Calculate the budget 

        // 5. Display the budget on the UI
        
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);