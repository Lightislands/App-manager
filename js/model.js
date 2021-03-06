// Start model.js
if (typeof(Storage) !== "undefined") {
} else {
    alert('No Web Storage support in your browser');
}

let itemController = (function(){

        let arrItems = [];
/*============================================= Add default =============================================*/

/* ------- Add default Items ------- */
        if (localStorage.getItem('ahData') === null){
            let arrSampleItems = [];

            let sampleData = function(link, name, category){
                this.link = link;
                this.name = name;
                this.category = category;
                this.pushToArr = () => {
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
            var newData = new sampleData('https://wetransfer.com/','Wetransfer', 'File Transfer');
            newData.pushToArr();
            var newData = new sampleData('https://openload.co','Openload', 'File Transfer');
            newData.pushToArr();
            var newData = new sampleData('https://www.dropbox.com/','Dropbox', 'File Storage');
            newData.pushToArr();
            var newData = new sampleData('https://drive.google.com/drive/my-drive','Google Drive', 'File Storage');
            newData.pushToArr();
            var newData = new sampleData('https://appear.in','Appear', 'Communication');
            newData.pushToArr();
            var newData = new sampleData('https://www.free-invoice-generator.com/','free-invoice-generator', 'Finance');
            newData.pushToArr();
            var newData = new sampleData('https://calendly.com/','Calendly', 'Scheduler');
            newData.pushToArr();

            localStorage.setItem('ahData', JSON.stringify(arrSampleItems));
        }

        // Load existing items from localStorage to arr
        arrItems = JSON.parse(localStorage.getItem('ahData'));



    let arrCategory = [];

    let NewCategory = function(name, itemCounter){
      this.name = name;
      this.itemCounter = itemCounter;

      this.pushToArr = () => {
          arrCategory.push(newCat);
      }
    };

    // Save default Category to localStorage if no Category there
    if (localStorage.getItem('ahCategories') === null){
        var newCat = new NewCategory('Task Management', 5);
        newCat.pushToArr();
        var newCat = new NewCategory('Mind Map', 4);
        newCat.pushToArr();
        var newCat = new NewCategory('File Transfer', 2);
        newCat.pushToArr();
        var newCat = new NewCategory('File Storage', 2);
        newCat.pushToArr();
        var newCat = new NewCategory('Communication', 1);
        newCat.pushToArr();
        var newCat = new NewCategory('Finance', 1);
        newCat.pushToArr();
        var newCat = new NewCategory('Scheduler', 1);
        newCat.pushToArr();

        localStorage.setItem('ahCategories', JSON.stringify(arrCategory));
    }
    arrCategory = JSON.parse(localStorage.getItem('ahCategories'));


/* ------- Convert categories data to make compatible with chip autocomplete ------- */
    
    function getDataAutocomplete(){
        let dataAutocomplete = {};
        for(let i=0; i<arrCategory.length; i++){
            let key = arrCategory[i].name;
            dataAutocomplete[key] = null;
        }
        return dataAutocomplete;
    }
    

    


    $(document).ready(function(){
/* ------- Initialize tags ------- */
        $('.chips').material_chip();

        $('.chips-autocomplete').material_chip({
            secondaryPlaceholder: 'Enter a category',
            placeholder: 'Add more + ',

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


/*============================================= Add new Category =============================================*/

    function addNewCat(newCat){
            let cat = new NewCategory(newCat, 0);
            arrCategory.push(cat);
            localStorage.setItem('ahCategories', JSON.stringify(arrCategory));
        }

/*============================================= Find Item by Link =============================================*/

    function findByLink(link){

        let item = {
            name: '',
            cat: []
        };
        
        for (let i = 0; i < arrItems.length; i++){ //search item to take its data for inputs

            if(link === arrItems[i].link){

                // Get item Name
                item.name = arrItems[i].name;

                // Get item Link
                item.link = arrItems[i].link;

                // Get item Categories
                let arrCurrentCategories = [];
                let categoriesString = arrItems[i].category; // getting string with all categories
                let categoriesParsed = categoriesString.split(","); // save categories to array

                for(let c=0; c<categoriesParsed.length; c++){ // Convert categories arr to obj for chip
                    let catObj = function(tag){
                        this.tag = tag;
                    };
                    let x = new catObj(categoriesParsed[c]);
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
        let itemLink = input.link;
        removeItem(itemLink);
    }

/*============================================= Remove Item ==============================================*/
    
    function removeItem(itemLink){
        let itemAllCategories;
        // find item
        for (let i = 0; i < arrItems.length; i++){
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
        let arrItemCat = item.category.split(',');

        // 2. Increase counter for each category
        for(let i=0; i<arrItemCat.length; i++){

            // Take index of category in array
            let index = arrCategory.map(function(e) {return e.name; }).indexOf(arrItemCat[i]);
            // Increase counter for categories
            arrCategory[index].itemCounter++;
        }

        //arrCategory.push(cat);
        localStorage.setItem('ahCategories', JSON.stringify(arrCategory));

    }


/*============================================= Check if categories empty ==============================================*/
// calculate items for each category

    function itemsInCatCounter(cats, items){

        for(let i=0; i<cats.length; i++){
            cats[i].itemCounter = 0; // Reset to 0

            items.map(function(el){
                let partsOfCatStr = el.category.split(',') // Split item cat string to separate cat item (for more than 1 cat)
                for(let c=0; c<partsOfCatStr.length; c++){
                    // if(partsOfCatStr[c] === cats[i].name){ // compare with string of all cats not only 1
                    //     cats[i].itemCounter++;
                    // }
                    partsOfCatStr[c] === cats[i].name ? cats[i].itemCounter++ : undefined; // compare with string of all cats not only 1
                }
            });
        }
        localStorage.setItem('ahCategories', JSON.stringify(arrCategory));
    }



/*============================================== Check All categories if they has an items =====================================*/

    function ifCatEmpty() {

        for(let i=0; i< arrCategory.length; i++) {
            if(arrCategory[i].itemCounter < 1){
                arrCategory.splice(i, 1);
                localStorage['ahCategories'] = JSON.stringify(arrCategory); // Save arr to localStorage
            }
        }
    }


/*============================================== Download =====================================*/
    
    function download() {
        let arrDownload = {};
        arrDownload['items'] = arrItems;
        arrDownload['categories'] = arrCategory;
        let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrDownload));
        return data;
    }

/*============================================= UPLOAD FILE ==========================*/
    
    function handleFileSelect(evt) {
        let files = evt.target.files; // FileList object
        // use the 1st file from the list
        f = files[0];
        let reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                let parsed = JSON.parse(e.target.result);

                let uploadedCategories = parsed.categories;
                let uploadedItems = parsed.items;

                itemController.categories = uploadedCategories;
                itemController.allItems = uploadedItems;

                localStorage.setItem('ahCategories', JSON.stringify(itemController.categories));
                localStorage.setItem('ahData', JSON.stringify(itemController.allItems));



                // 3. Reload all items in UI
                UIController.displayItems();
                // 4. Reload categories in UI (in case new category added)
                UIController.buildCatList();



            };
        })(f);
        // Read in the file as a data URL.
        reader.readAsText(f);
    }
    
/*============================================= UPLOAD FILE ==========================*/
    
    function getNameFromLink (e){
        let link = e.originalEvent.clipboardData.getData('text');
        function extractHostname(url) {
            let hostname = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
            return hostname;
        }
        let urlName = extractHostname(link).split('.')[0]; // remove ".com"
        return (urlName);
    }
    

    return {
        getNameFromLink: getNameFromLink,
        
        handleFileSelect: handleFileSelect,
        
        download: download,

        itemsInCatCounter: itemsInCatCounter,

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

        allItems: arrItems
    };

})();

