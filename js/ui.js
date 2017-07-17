// Start ui.js

var UIController = (function(){
    
    var DOMstrings = {
        inputLink: '#add__link',
        //inputName: '#add__name',
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

    var DOM = DOMstrings;
    var allItems = itemController.allItems;



    /*============================================= Build items list =============================================*/

    function addListItem(cat){

            var itemsList = '';
            var allItems = itemController.allItems;
            var newItem;
            var item = '<div class="item"><a class="edit"><i class="material-icons">mode_edit</i></a><a class="remove"><i class="material-icons">delete</i></a><a class="link" target="_blank" href="%link%"><img src="https://icons.better-idea.org/icon?url=%link%&size=80..120..200" /><p>%name%</p></a></div>';

            function buildItem(){
                newItem = item.replace(/%link%/g, allItems[i].link);
                newItem = newItem.replace(/%name%/g, allItems[i].name);
                itemsList = itemsList + newItem;
            }

            if(cat){ // if invoked with parameter (click on category name)
                for(var i=0; i<allItems.length; i++){

                    // if more than 1 category in item
                    var cats = allItems[i].category.split(',');
                    for(var c=0; c<cats.length; c++){
                        if(cat === cats[c]){
                            buildItem();
                        }
                    }
                }
            }else {
                for(var i=0; i<allItems.length; i++){
                    buildItem();
                }
            }
        
            $('.itembox').empty() .append(
                itemsList
            );
    }


    /*============================================= Remove Item =============================================*/

    function removeThisItem() {

        var item = event.target.parentNode.parentNode;
        var itemLink = $(event.target).parent().parent().find('a.link').attr('href');
        
        
        // find item
        /*for (var i = 0; i < allItems.length; i++){
            if(itemLink === allItems[i].link){
                itemAllCategories = allItems[i].category;
                allItems.splice(i, 1);
            }
        }*/
        
        // Remove Item and get its Categories
        var itemAllCategories = itemController.removeItem(itemLink);

        localStorage['ahData'] = JSON.stringify(allItems); // Save arr to localStorage
        item.remove(); // Remove item from UI

        // Remove category if empty
        removeCategory(itemAllCategories);
    }


    // Check if category has any item, if no - remove category

    function removeCategory(cat) {

        var itemCategories = cat.split(','); // Get Array of item categories


        for (var i=0; i<itemCategories.length; i++){

            var catOfItem = itemCategories[i]; // array with cats of item
            var allCat = itemController.categories;

            // 1. Find Item in All cat aray (take index of cat obj in array)
            var index = allCat.map(function(e) {return e.name; }).indexOf(catOfItem);

            // 2. Reduce item Counter
            allCat[index].itemCounter--;


            // check amount of items in category
            itemController.ifCatEmpty();
            
            /*
            if(allCat[index].itemCounter == 0){
                allCat.splice(index,1);
                localStorage['ahCategories'] = JSON.stringify(allCat);
                itemController.buildCatList();
            }
            */
            
        }

    }



    /*============================================= Edit Item =============================================*/

    function editThisItem() {

        $(DOM.modalEditItem+' label').css('display', 'none');  // hide input label in modal

        // ------------ Get item link
        var itemLink = $(event.target).parent().parent().find('a.link').attr('href');

        // ------------ Get item by link from itemController
        var item = itemController.findItemByLink(itemLink);

        
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

            var catObj; // take data Obj from chip and save to array

            if(edit){
                catObj = $(DOM.inputCategoryEdit).material_chip('data');
            }else {
                catObj = $(DOM.inputCategory).material_chip('data');
            }


            var catList = [];
            var allCatCopy = itemController.categories;

            for(var i=0; i< catObj.length; i++) {
                // create arr with chip data (convert chip objects to arr items)
                catList.push(catObj[i].tag);

                // if new category
                // Check if Object value already exist in array of objects
                var exist, newCatItem;
                for(var c=0; c < allCatCopy.length; c++){
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
            var NewItem = {};
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

        removeItem: removeThisItem,

        editItem: editThisItem,

        getDOMstrings: function(){
            return DOMstrings;
        },

        displayItems: addListItem
        




    };

})();