// Todo - Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const formRow = document.querySelectorAll(".form-row")[1];
// Todo - Filter Input Alanı
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

// * ----------------------------------------------------------------------
// Todo - Tüm event Listenerlerin bulunacağı bölüm
function eventListeners(){

    // Todo - İnput'un içindeki form submit işlemi olduğunda çalışacak fonksiyon
    form.addEventListener("submit",addTodo);

    // Todo - Sayfa yüklendiğinde LOCALSTORAGE'deki değerleri listeye ekleme fonksiyonu
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);

    // Todos - secondCardBody click eventi olduğunda todo list'den değer silme fonksiyonu
    secondCardBody.addEventListener("click",deleteTodo);

    // Todos - Arama Input'una değer girerek bunu filtreleme işlemi yapacağız
    // Todos - eğer inputa girilen değer todo'ların içinde geçiyorsa ekrana yazdıracak
    filter.addEventListener("keyup",filterTodos);

    // Todos - Tüm taskları temizleme butonuna tıklandığında tüm todosları silecez
    clearButton.addEventListener("click",clearAllTodos);

}

// İŞLEM 1 TODOLARI EKLEDİK
// * ----------------------------------------------------------------------

// Todo - TODO EKLEME
function addTodo(e){

    // Todo - input içindeki değeri alıyoruz
    // Todo - input alanındaki baştaki ve sondaki boşlukları silmek için trim() kullanırız
    const newTodo = todoInput.value.trim();

    // Todo - Eğer input alanı boşsa eklememe kontrol etme işlemi
    if(newTodo === ""){
        showAlert("danger","Lütfen bir todo giriniz...");
    }
    else{
        const data = getTodosFromStorage();
        const isUnique = sameTodoQuery(data,todoInput.value);
         if(!isUnique){
             // Todo - aldığı string değerini list ıtem olarak UI'e ekleyecek
            addTodoUI(newTodo);

            // Todo - Todo'ları LOCALSTORAGE ekleme
            addTodoToStorage(newTodo);
            showAlert("success","Todo Başarıyla eklendi.");
         }else{
            showAlert("danger",`${todoInput.value} zaten var`);
         }
    }

    e.preventDefault();
}


// Todo Aynı todo mu degilmi kontrol etmek için function
const sameTodoQuery = (array,el) => {
    for(const val of array){
        if(val === el ) return true;
    }
}

// İŞLEM 2 TODOLARI ARAYÜZE EKLİYORUZ
// * ----------------------------------------------------------------------
// Todos - TODO'larımızı ARAYÜZ'e ekliyoruz bu fonksiyon ile;
function addTodoUI(newTodo){

    // Todo -  List ITEM oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";

    // Todo - Link Oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    // Todo - Text Node ve Link'i Ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // Todo - Todo List'e List Item'i ekleme
    todoList.appendChild(listItem);

    // Todo Ekleme işlemi bittikten sonra input value'Yi boşaltma
    // todoInput.value = "";
}

// İŞLEM 3 TODO KOŞULLARI GERÇEKLELŞTİĞİNDE UYARI ALARMI VERDİRİYORUZ
// * ----------------------------------------------------------------------
// Todo - Hata mesajı oluşturma
function showAlert(type,message){
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    // Todo - Alert belirttiğimiz saniye sonrasında sayfadan silinmesi için
    setTimeout(function(){
        alert.remove();
    },1000);
     
};

// İŞLEM 4 TODOLARI LOCALSTORAGE'e ekliyoruz
// * ----------------------------------------------------------------------

// Todo - Değerleri LOCALSTORAGE ekleme
function addTodoToStorage(newTodo){
    
    // Todo - Todosları aldık
    let todos = getTodosFromStorage();

    // Todo - Bize gönderilen text'i şimdi ekliyoruz LOCALSTORAGE'e
    todos.push(newTodo);

    // Todo - Buradaki değerimizi güncelliyoruz çünkü sürekli yeni bir
    // Todos - todos geleceği için güncellememiz gerekiyor
    localStorage.setItem("todos",JSON.stringify(todos));
}

// Todos - her yerde kullanacağımız için bunu bir fonksiyon haline getiriyoruz
// Todos -  bu fonksiyon LOCALSTORAGE'deki bütün todos'ları bize almış olacak
function getTodosFromStorage(){
   // Todos - LOCALSTORAGE'deki todosları eklemek için oluşturduk;
   let todos;

   // Todo - todos adında bir key var mı yok mu kontrol ediyoruz
   if(localStorage.getItem("todos") === null){
       todos = [];
   }else{

       // Todos - Eğer değer varsa burda işlemleri yapyıoruz
       // Todos - JSON PARSE ile array'e çeviriyoruz
       todos = JSON.parse(localStorage.getItem("todos"));
   }
   return todos;
}

// İŞLEM 5 LOCALSTORAGE'deki TODOLARI ARAYÜZE EKLİYORUZ
// * ----------------------------------------------------------------------

// Todo - LOCALSTORAGE'deki todoları alıp arayüzdeki listeye ekleme fonksiyonu
function loadAllTodosToUI(){

    // Todos - LOCALSTORAGE'deki değerleri aldık 
    let todos = getTodosFromStorage();
    
    // Todos - Şimdi aldığımız değerleri foreach ile dönerek hepsini yazdıralım
    todos.forEach(function(todo){
        addTodoUI(todo);
    });
}

// İŞLEM 6 TIKLADIĞIMIZ TODOLARI SİLİYORUZ
// * ---------------------------------------------------------------------- 
function deleteTodo(e){
    // Todos - Nereye basıldığını öğrenmek için yazacağımız kod

    // Todos - Sadece buradaki butonlaramı tıklanmış bunun kontrolü için aşağıdaki kod
    // Todos - Burada sadece classı fa fa-remove olana tıklandığında silme işlemi yapmak için kontrol ettik
    if(e.target.className === "fa fa-remove"){

        // Todos - Burada li yi silmek istediğimiz için i'nin üzerindeki a elementine çıkıyoruz 
        // Todos - devamı... ve ardından a'nın üsütndeki li elementine çıkıp silme işlemini gerçekleştiiriyoruz.
        e.target.parentElement.parentElement.remove();

        // Todos - Bu şekilde yaparak todo'nun değerini deleteTodoFromLocalstorage'e fonksiyonuna göndermiş oluyoruz.
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);

        // Todos - silindiğine dair uyarı vermek için alert'i kullanıyoruz
        showAlert("success","Todo başarıyla silindi...");
    }
}

// İŞLEM 7 LOCALSTORAGE'deki TODOLARI SİLİYORUZ 
// * ----------------------------------------------------------------------
// Todo - LOCALSTORAGE'deki todo'yu silmek için bu fonksiyonu yazdık
// Todo - ve içine todo adında bir değer yolluyoruz ki sileceğimiz todoyu gönderebilelim
function deleteTodoFromStorage(deletetodo){

    // TODOS - LOCALSTORAGE'deki todos'ları  bir array olarak alıyoruz
    let todos = getTodosFromStorage();

    // TODOS - foreach döngüsüyle içinde dönüyoruz ve todo değişkeninden gelen her bir değeri varmı diye sorgulayacağız 
    // TODOS - ve eğer varsa sileceğiz
    todos.forEach(function(todo,index){

        // TODOS eğer diyoruz todos'daki değer gelen deletetodo değerine eşitse sil işlemi yapacağız
        if(todo === deletetodo){

            // TODOS - ARRAY'den veri silmek için splice() methodunu kullanıyoruz
            // TODOS - içine silinecek indexi veriyoruz ve 1 ise o index'den sonra 1 değer silineceğini belirtiyoruz.
            todos.splice(index,1);
        }
    });

    // Todos - SİLME İŞLEMLERİ YAPILDIKTAN SONRA LOCALSTORAGE'yi güncellememiz gerekiyor
    localStorage.setItem("todos",JSON.stringify(todos));
    
}
// * ----------------------------------------------------------------------

function filterTodos(e){
    
    // Todos - input içine  girdiğimiz değer var ise göster yok ise gizle yapacğız
    // Todos - İnput içine girdiğimiz değeri seçtik ve hepsini küçük harfe dönüştürdük
    const filterValue = e.target.value.toLowerCase();
    
    // Todos - işlemleri karşılaştırabilmek için tüm 'li' elemanlarını seçiyoruz
    const listItems = document.querySelectorAll(".list-group-item");
    
    // Todos - Tüm elemanların içnide forEach ile geziyoruz
    listItems.forEach(function(listItem){

        // Todos - Listıtems textConten'ini alıyoruz ve onuda küçük harfe dönüştüüryoruz
        // Todos - küçük harf yapma sebebimiz input içindeki değerle karşılaştırabilmek için
        const text = listItem.textContent.toLowerCase();

        // Todos - eğer input içinde text geçiyorsa kontrollerini yapıyoruz
        // Todos - en az 2 harfin içinde geçmesi gerektiğini söylüyoruz indexOf() ile
        if(text.indexOf(filterValue) === -1){

            // Todos - eğer -1 dönerse değer yoktur
            // Todos - Eğer değer diğer 'li' elementlerinde geçmiyorsa style özelliğini display:none yapyoruz
            // Todos - style özelliği ekliyoruz çünkü bulamadı
            listItem.setAttribute("style","display:none !important");
        }else{
            // Todos- değer vardır
            // Todos - style özelliği ekliyoruz çünkü buldu.
            listItem.setAttribute("style","display:block");
        }
    });
}

// * ---------------------------------------------------------------------- 
function clearAllTodos(e){
    // TODOS- öncesinde bir confirm butonu ayarlıyoruz ve kullanıcı evet derse silecek
    if(confirm("Tümünü silmek istediğinize emin misiniz ?")){
            // TODOS - ARAYÜZDEN TODOLARI TEMİZLEME
           // . todoList.innerHTML = ""; // YAVAŞ YÖNTEM

           // TODOS - FirstElementChild null olma durumunu kontrol ediyoruz
           // TODOS - while döngüsü hepsi silinene kadar çalışmaya devam edecek
           // TODOS - BU YÖNTEM DAHA HIZLI BİR YÖNTEM
           while(todoList.firstElementChild != null){
                todoList.removeChild(todoList.firstElementChild);
                localStorage.removeItem("todos");
           }
    }
 
}