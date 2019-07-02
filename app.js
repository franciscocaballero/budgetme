let budgetController = (function(){

    let x = 23;

    let add = function(a){
        return x + a;
    }

    return {
        publicTest: function(b) {
            console.log(add(b));
        }
    }
     
})();

let UIController = (function(){
    // code 
})();

let controller = (function(budgetCtrl, UICtrl){
    //code 
    let budgetCtrl.publicTest(5);

    return {
        another
    }
})(budgetController, UIController);