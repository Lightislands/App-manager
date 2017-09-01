// Start controller.js


let controller = ((itemCtrl, UICtrl) => {
/* =================================================== Materialize =================================================== */

// Initialize collapse button
    $('.button-collapse').sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
    $('.collapsible').collapsible();
// Initialize modal
    $('.modal').modal();

/* =================================================== Event Listeners =================================================== */

    // Events
    let setupEventListeners = () => {

        let DOM = UIController.getDOMstrings();


        // Add new inputs

        $(DOM.addNewItem).on( "submit", function( event ) {
            event.preventDefault();
            ctrlAddItem();
        });

        // Show Items in Category
        
        $(DOM.catName).on( "click", function( event ) {
            event.preventDefault();
            let cat = $(event.target).parent().find('a').text();
            UICtrl.displayItems(cat);
        });
        
        // Remove item
        
        $('.itembox').on( 'click', DOM.removeItem, function( event ) {
            event.preventDefault();
            ctrlRemoveItem();
        });

        // Edit item
        
        $('.itembox').on( 'click', DOM.editItemBtn, function( event ) {
            event.preventDefault();
            $(DOM.modalEditItem).modal('open');
            UICtrl.editItem();
        });

        $(DOM.editItem).on( "submit", function( event ){
            event.preventDefault();
            ctrlEditItem();
        });
    };


/*============================================= Add new items =============================================*/
    let ctrlAddItem = () => {
        
        let input, newItem;
        // 1. Get input
        input = UIController.getInput();

        // 2. Add input to model, Save Item
        newItem = itemController.addItem(input);

        // 3. Increase counter in categories
        itemController.catCounter(input);

        // 4. Reload all items in UI
        UIController.displayItems();

        // 5. Reload categories in UI (in case new category added)
        UIController.buildCatList();
    };


/*============================================= Edit items - Submit =============================================*/
    // Submit existing in the form data
                                                // !!! Eny field can be changed, category amounts also!!!
    let ctrlEditItem = () => {

        let input;
        // 1. Get input
        input = UIController.getInput('edit');

        // 2. Find and remove item by link from Array
        itemController.removeIfEdit(input);

        // 3. Add input to modal, Save Item
        itemController.addItem(input);

        // Increase counter in categories
        //itemController.catCounter(input); // What if delete category?

        // 4. Reload all items in UI
        UIController.displayItems();

        // 5. Remove category if empty
        //itemController.ifCatEmpty();
        // 5. Calculate items in cat
        itemController.itemsInCatCounter(itemController.categories, itemController.allItems);

        // 6. Reload categories in UI (in case new category added)
        UIController.buildCatList();

    };

/*============================================= Remove items =============================================*/

    let ctrlRemoveItem = () => {
        
        UICtrl.removeItem();

        // check amount of items in category
        itemController.ifCatEmpty();

        // refresh cat list
        UIController.buildCatList();
    };


    return {
        init: function(){
            UIController.displayItems();
            console.log('Init');
            setupEventListeners();
        }
    };
    
})(itemController, UIController); // Invoke controller with this parameters, so it can use its methods

controller.init();
















