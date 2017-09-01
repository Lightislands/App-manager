// Start ui.js

let UIController = (() => {
    
    let DOMstrings = {
        inputLink: '#add__link',
        inputCategory: '#add__category',
        inputCategoryHidden: 'input[name="category"]',
        newBtn: '#add-new',
        addNewItem: '#add-item',
        catName: '.side-nav',
        removeItem: '.remove',
        editItemBtn: '.edit',
        chipTagsWrap: '.chips-autocomplete',
        modalEditItem: '#modalEditItem',
        editItem: '#edit-item',
        inputCategoryEdit: '#edit__category'
    };

    let DOM = DOMstrings;
    let allItems = itemController.allItems;



    /*============================================= Build Categories list =============================================*/
    let buildCategoryList = () => {
        let categoryList = "";
        for (let [i, value] of itemController.categories.entries()) { // using destructuring and .entries
            categoryList = categoryList+`<li><a class="waves-effect" href="#">${itemController.categories[i].name}</a><span>${itemController.categories[i].itemCounter}</span></li>`
        }
        $('.side-nav').empty().append(categoryList);
    };
    buildCategoryList();



    /*============================================= Build items list =============================================*/

    let addListItem = cat => {

            let itemsList = '';
            let allItems = itemController.allItems;
            let newItem;
            let item = '<div class="item"><a class="edit"><i class="material-icons">mode_edit</i></a><a class="remove"><i class="material-icons">delete</i></a><a class="link" target="_blank" href="%link%"><img src="https://icons.better-idea.org/icon?url=%link%&size=80..120..200" /><p>%name%</p></a></div>';

            function buildItem(){
                newItem = item.replace(/%link%/g, allItems[i].link);
                newItem = newItem.replace(/%name%/g, allItems[i].name);
                itemsList = itemsList + newItem;
            }

            let i;
            if(cat){ // if invoked with parameter (click on category name)
                for(i=0; i<allItems.length; i++){

                    // if more than 1 category in item
                    let cats = allItems[i].category.split(',');
                    for(let c=0; c<cats.length; c++){
                        if(cat === cats[c]){
                            buildItem();
                        }
                    }
                }
            }else {
                for(i=0; i<allItems.length; i++){
                    buildItem();
                }
            }
        
            $('.itembox').empty() .append(
                itemsList
            );
    };


    /*============================================= Remove Item =============================================*/

    function removeThisItem() {

        let item = event.target.parentNode.parentNode;
        let itemLink = $(event.target).parent().parent().find('a.link').attr('href');

        // Remove Item and get its Categories
        let itemAllCategories = itemController.removeItem(itemLink);

        localStorage['ahData'] = JSON.stringify(allItems); // Save arr to localStorage
        item.remove(); // Remove item from UI

        // Remove category if empty
        removeCategory(itemAllCategories);
    }


    // Check if category has any item, if no - remove category

    function removeCategory(cat) {

        let itemCategories = cat.split(','); // Get Array of item categories

        for (let i=0; i<itemCategories.length; i++){

            let catOfItem = itemCategories[i]; // array with cats of item
            let allCat = itemController.categories;

            // 1. Find Item in All cat array (take index of cat obj in array)
            let index = allCat.map(function(e) {return e.name; }).indexOf(catOfItem);
            // 2. Reduce item Counter
            allCat[index].itemCounter--;
        }
    }



    /*============================================= Edit Item =============================================*/

    function editThisItem() {

        $(DOM.modalEditItem+' label').css('display', 'none');  // hide input label in modal

        // ------------ Get item link
        let itemLink = $(event.target).parent().parent().find('a.link').attr('href');

        // ------------ Get item by link from itemController
        let item = itemController.findItemByLink(itemLink);

        
        // ------------ Filing the form

        // Link
        $('input[name="link"]').val(item.link);

        // Name
        $('input[name="name"]').val(item.name);

        // Cat
        $(DOM.chipTagsWrap).material_chip({
            placeholder: 'Add more +',
            secondaryPlaceholder: 'Enter a category',
            data: item.cat,

            autocompleteOptions: {
                data: itemController.getDataAutocomplete(), // !!!!!!!!! Undefined
                limit: Infinity,
                minLength: 1
            }

        });

       // $('input[name="category"]').val(item.cat); // store chip data arr to hidden input
        
    }



    return {
        /*============================================= Get data from inputs =============================================*/
        getInput: function(edit) {

            // Take data from Form

            let catObj; // take data Obj from chip and save to array

            if(edit){
                catObj = $(DOM.inputCategoryEdit).material_chip('data');
            }else {
                catObj = $(DOM.inputCategory).material_chip('data');
            }


            let catList = [];
            let allCatCopy = itemController.categories;

            for(let i=0; i< catObj.length; i++) {
                // create arr with chip data (convert chip objects to arr items)
                catList.push(catObj[i].tag);

                // if new category
                // Check if Object value already exist in array of objects
                let exist, newCatItem;
                for(let c=0; c < allCatCopy.length; c++){
                    if(catObj[i].tag == allCatCopy[c].name){
                        exist=1;
                        break;
                    }else{
                        exist=0;
                        newCatItem = catObj[i].tag;
                    }
                }
                if(exist == 0){
                    itemController.addCategory(newCatItem);
                }
            }
            

            $(DOM.inputCategoryHidden).val(catList); // store chip data arr to hidden input


            // take data from inputs
            let NewItem = {};
            $(DOM.addNewItem).serializeArray().forEach(function(item) {
                NewItem[item.name] = item.value;
            });

            
            if(edit){

                $(DOM.editItem).serializeArray().forEach(function(item) {
                    NewItem[item.name] = item.value;
                });
                
                // !!!!!!  Check if all categories (All, not only item categories) has an items
                
            }
            
            return NewItem;
        },
        buildCatList: buildCategoryList,
        
        removeItem: removeThisItem,

        editItem: editThisItem,

        getDOMstrings: function(){
            return DOMstrings;
        },

        displayItems: addListItem
    };

})();