// Start model.js
if (typeof(Storage) !== "undefined") {
} else {
    alert('No Web Storage support in your browser');
}

var itemController = (function(){

        var arrItems = [];
/*============================================= Add default =============================================*/

/* ------- Add default Items ------- */
        if (localStorage.getItem('ahData') === null){
            var arrSampleItems = [];

            var sampleData = function(link, name, category){
                this.link = link;
                this.name = name;
                this.category = category;
                this.pushToArr = function(){
                    arrSampleItems.push(newData);
                }
            };
            var newData = new sampleData('https://app.asana.com/','Asana', 'Task Management');
            newData.pushToArr();
            var newData = new sampleData('https://trello.com/','Trello', 'Task Management');
            newData.pushToArr();
            var newData = new sampleData('http://taskify.us','Taskify', 'Task Management');
            newData.pushToArr();
            var newData = new sampleData('https://www.droptask.com/','Droptask', 'Task Management');
            newData.pushToArr();
            var newData = new sampleData('https://www.meistertask.com/','MeisterTask', 'Task Management');

            newData.pushToArr();
            var newData = new sampleData('https://drive.mindmup.com/','MindMup', 'Mind Map');
            newData.pushToArr();
            var newData = new sampleData('http://drichard.org/mindmaps/','Drichard', 'Mind Map');
            newData.pushToArr();
            var newData = new sampleData('https://coggle.it/','Coggle', 'Mind Map');
            newData.pushToArr();
            var newData = new sampleData('https://www.mindmeister.com/','Mindmeister', 'Mind Map');
            newData.pushToArr();
            var newData = new sampleData('https://wetransfer.com/','Wetransfer', 'File transfer');
            newData.pushToArr();
            var newData = new sampleData('https://www.dropbox.com/','Dropbox', 'File storage');
            newData.pushToArr();
            var newData = new sampleData('https://drive.google.com/drive/my-drive','Google Drive', 'File storage');
            newData.pushToArr();

            localStorage.setItem('ahData', JSON.stringify(arrSampleItems));
        }

        // Load existing items from localStorage to arr
        arrItems = JSON.parse(localStorage.getItem('ahData'));



    var arrCategory = [];

    var NewCategory = function(name, itemCounter){
      this.name = name;
      this.itemCounter = itemCounter;

      this.pushToArr = function(){
          arrCategory.push(newCat);
      }
    };

    // Save default Category to localStorage if no Category there
    if (localStorage.getItem('ahCategories') === null){
        var newCat = new NewCategory('Task Management', 5);
        newCat.pushToArr();
        var newCat = new NewCategory('Mind Map', 4);
        newCat.pushToArr();
        var newCat = new NewCategory('File transfer', 1);
        newCat.pushToArr();
        var newCat = new NewCategory('File storage', 2);
        newCat.pushToArr();
        var newCat = new NewCategory('Uncategorised', 0);
        newCat.pushToArr();

        localStorage.setItem('ahCategories', JSON.stringify(arrCategory));
    }
    arrCategory = JSON.parse(localStorage.getItem('ahCategories'));


/* ------- Convert categories data to make compatible with chip autocomplete ------- */
    
    function getDataAutocomplete(){
        var dataAutocomplete = {};
        for(var i=0; i<arrCategory.length; i++){
            var key = arrCategory[i].name;
            dataAutocomplete[key] = null;
        }
        return dataAutocomplete;
    }
    

    


    $(document).ready(function(){
/* ------- Initialize tags ------- */
        $('.chips').material_chip();

        /*$('.chips-initial').material_chip({

            data: [{
             tag: 'Task Management',
             }, {
             tag: 'Mind Map',
             }, {
             tag: 'File transfer',
             }, {
             tag: 'File storage',
             },{
             tag: 'Uncategorised',
             }],

        });*/

        $('.chips-autocomplete').material_chip({
            placeholder: 'Add more +',
            secondaryPlaceholder: 'Enter a category',

            autocompleteOptions: {
                data: getDataAutocomplete(),
                limit: Infinity,
                minLength: 1
            },
            data: [{
                tag: 'Uncategorised'
            }]
        });
    });

    
/*============================================= Build Categories list =============================================*/
    function buildCategoryList(){
        var categoryList = "";
        for (var i=0; i < arrCategory.length; i++){
            categoryList = categoryList + '<li><a class="waves-effect" href="#">'+ arrCategory[i].name +'</a></li>'
        }
        $('.side-nav').empty().append(categoryList);
    }buildCategoryList();

    

/*============================================= Add new Category =============================================*/

    function addNewCat(newCat){
            var cat = new NewCategory(newCat, 0);
            arrCategory.push(cat);
            localStorage.setItem('ahCategories', JSON.stringify(arrCategory));
        }

/*============================================= Find Item by Link =============================================*/

    function findByLink(link){

        var item = {
            name: '',
            cat: []
        };
        
        for (var i = 0; i < arrItems.length; i++){ //search item to take its data for inputs

            if(link === arrItems[i].link){

                // Get item Name
                item.name = arrItems[i].name;

                // Get item Link
                item.link = arrItems[i].link;

                // Get item Categories
                var arrCurrentCategories = [];
                var categoriesString = arrItems[i].category; // getting string with all categories
                var categoriesParsed = categoriesString.split(","); // save categories to array

                for(var c=0; c<categoriesParsed.length; c++){ // Convert categories arr to obj for chip
                    var catObj = function(tag){
                        this.tag = tag;
                    };
                    var x = new catObj(categoriesParsed[c]);
                    arrCurrentCategories.push(x);
                }

                item.cat = arrCurrentCategories;
                break;
            }
        }
        return item;
    }


/*============================================= If Item Exist =============================================*/

    function removeIfEdit(input){
        var itemLink = input.link;
        removeItem(itemLink);
    }

/*============================================= Remove Item ==============================================*/
    
    function removeItem(itemLink){
        var itemAllCategories;
        // find item
        for (var i = 0; i < arrItems.length; i++){
            if(itemLink === arrItems[i].link){
                itemAllCategories = arrItems[i].category;
                arrItems.splice(i, 1);
            }
        }
        
        console.log('item removed')
        return itemAllCategories; // Return Items categories
    }


/*============================================= Increase categories counter ==============================================*/

    function catCounter(item){

        // 1. Find categories in arrCategories
        var arrItemCat = item.category.split(',');
        //var allCat = itemController.categories;

        // 2. Increase counter for each category
        for(var i=0; i<arrItemCat.length; i++){

            // Take index of category in array
            var index = arrCategory.map(function(e) {return e.name; }).indexOf(arrItemCat[i]);
            // Increase counter for categories
            arrCategory[index].itemCounter++;
        }

        //arrCategory.push(cat);
        localStorage.setItem('ahCategories', JSON.stringify(arrCategory));

    }


/*============================================== Check All categories if they has an items =====================================*/

    function ifCatEmpty() {

        for(var i=0; i< arrCategory.length; i++) {
            if(arrCategory[i].itemCounter < 1){

                arrCategory.splice(i, 1);

                localStorage['ahCategories'] = JSON.stringify(arrCategory); // Save arr to localStorage
                buildCategoryList();
            }

        }
    }





    return {

        getDataAutocomplete: getDataAutocomplete,
        
        ifCatEmpty: ifCatEmpty,

        catCounter: catCounter,

        removeIfEdit: removeIfEdit,

        removeItem: removeItem,
        
        findItemByLink: findByLink,

        categories: arrCategory,

        addItem: function(item) {

            // Save new item to Array and to LocalStorage
            arrItems.push(item);
            localStorage['ahData'] = JSON.stringify(arrItems);
        },
        
        addCategory: function (newCat) {
            addNewCat(newCat);
        },
        
        buildCatList: buildCategoryList,

        allItems: arrItems


    };


    
})();
