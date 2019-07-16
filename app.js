//*********************/BUDGET CONTROLLER*****************************/
//********************************************************************

let budgetController = (function () {

    //some code 
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function (type) {
        let sum = 0;

        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
            // sum = sum + cur.value;
        });
        data.totals[type] = sum; // storing value in totals 
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            let newItem, ID;

            //[1 2 3 4 5 ], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1 

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

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

        deleteItem: function (type, id) {
            let ids, index;

            // ID = 3 
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            // Calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');
            // Calculate the budget: income - expenses 
            data.budget = data.totals.inc - data.totals.exp;
            // Calculate the percentage of income that we spent 

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

                // Expense = 100 and income 200, spent 50% = 100/200 = 0.5 * 100
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentages: function () {




            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            let allPerctages = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerctages;

        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data)
        }
    };

})();

let Expense = function (id, description, value) {
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    let formatNumber = function (num, type) {
        let numSplit, int, dec;
        /*
       + or - before number 
       exacly 2 decimal points 
       comma separating the thousands 

       2310.4567 -> + 2,310.46
       2000 -> + 2,000.00
        */
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); //input 23510, output 23,510
        }
        dec = numSplit[1];

        // type == 'exp' ? sign = '-' : sign = '+';

        return (type === 'exp' ? '-' : '+') + ' ' + int + "." + dec;

    };

    let nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
        };

    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be ether inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // covert string to number
            };
        },

        addListItem: function (obj, type) {
            let html, newHtml, element;
            //create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>
                        <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>
                        <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>
                        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            }

            //Replace the placeholder text with some acutal data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {

            let el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
            // let element = document.getElementById('selectorID')
            // document.getElementById('selectorID').parentNode.removeChild(document.getElementById('selectorID'));

        },

        clearFields: function () {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            // Coverting List into an array using the slice method.

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayPercentages: function (percentages) {

            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth: function () {
            let now, month, year;

            now = new Date();

            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            month = now.getMonth();

            year = now.getFullYear();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        getDOMStrings: function () {
            return DOMstrings;
        },

        displayBudget: function (obj) {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            //Budget 
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);

            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');

            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },
        changedType: function () {

            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        testing: function () {
            console.log(data);
        }
    };

})();



//*********************/GLOBAL APP CONTROLLER/*******************************
//******************************************************************* 
let controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    let updateBudget = function () {
        // 1. Calculate the budget 
        budgetCtrl.calculateBudget();
        //  2. Return the budget
        let budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function () {

        // 1. Calculate percentages 
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from the budget controller 
        let percentages = budgetCtrl.getPercentages();
        // 3. Update the UI with the new percentages 
        UICtrl.displayPercentages(percentages);
    }

    let ctrlAddItem = function () {
        let input, newItem;
        // 1. Get the field input data 

        input = UICtrl.getInput();
        console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4. Clear fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages 
            updatePercentages();
        }

    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure 
            budgetCtrl.deleteItem(type, ID);
            // 2.Delte the itme fro the UI
            UIController.deleteListItem(itemID);
            // 3. Update and show the new Budget 
            updateBudget();
        }
    };

    return {
        init: function () {
            console.log('Application has started!');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };




})(budgetController, UIController);


controller.init();