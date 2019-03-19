
class Todo {

    constructor(){
        this.name = document.getElementById("myInput").value;
        this.list = document.querySelector('ol');
        if(this.emptyAlert()){
            let inputValue=this.emptyAlert();
            this.createTodo(inputValue,dateAndTime(),"W");
            this.readTodos(1);
            this.deletetodos();
            this.editTodo();        
        }   
        this.readTodos(1);
       // this.toogleSubTasks(this.list);      
    }
    toogleSubTasks(list){
        list.addEventListener('click', (ev)=> { 
           var clickcounter =0;
           let evtarget = ev.target;
           if (ev.target.tagName === 'LI') {
                let allLi = document.querySelectorAll("LI");
                allLi.forEach((li)=>{
                    if(li.classList.contains("checked")){
                        if(li.textContent != ev.target.textContent){
                            li.classList.toggle("checked");
                            li.lastChild.remove();
                        }
                    }
                });
                ev.target.classList.toggle('checked');
                var ischecked = ev.target.classList.contains("checked")
                if(ischecked){
                    let subContainer = this.createElement("div");
                    subContainer.id = "subTaskList";
                    let subTaskInput = this.createElement("input");
                    subTaskInput.setAttribute("placeholder","Add SubTask...");
                    subTaskInput.id = "subInput";
                    subTaskInput.className="subinput";
                    let subTaskAdd = this.createElement("button");
                    let subTaskSpan = this.createElement("span"); 
                    let spanText = this.createTextNode("+");
                    subTaskSpan.appendChild(spanText);
                    subTaskAdd.className = "subTaskAdd";
                    subTaskAdd.id = "subTaskAdd"
                    subTaskAdd.appendChild(subTaskSpan);
                    subContainer.appendChild(subTaskInput);
                    subContainer.insertBefore(subTaskAdd, subTaskInput);
                    let subTaskInfo = this.createElement("span");
                    let subTaskTitle = this.createElement("span");
                    subTaskTitle.className= "subTaskTitle";
                    subTaskTitle.textContent =`SubTasks :`
                    subTaskInfo.textContent =`click = Edit , dclick = Save`
                    subTaskInfo.className= "subTaskInfo";
                    subContainer.appendChild(subTaskTitle);
                    subContainer.appendChild(subTaskInfo);
                    ev.target.appendChild(subContainer);
                    let mainTaskValue = ev.target.childNodes[0].textContent; 
                    this.createSubTask(mainTaskValue); 
                }
                if(!ischecked){
                    document.getElementById("subTaskList").remove();       
                } 
            }      
        }, false);
        }
    editTodo(){
       let edit = document.getElementsByClassName("edit");
        for (let i = 0; i < edit.length; i++) {
            edit[i].onclick = ()=>{
                let thecorentTodo = edit[i].parentElement;
                let stringtofilter = thecorentTodo.firstChild.textContent;  
                thecorentTodo.childNodes[0].textContent = prompt("Edit :",stringtofilter);
                let stringToreplace = thecorentTodo.childNodes[0].textContent;
                let newArray = [];
                let newSubTaskArray = [];
                let objtable = this.storageRead("toDos");
                objtable.forEach((item)=>{
                    let endIndex = item.search("&");
                    let itemTime = item.substring(0,endIndex); 
                    let ItemValue = item.substring(endIndex+1);  
                    if(ItemValue == stringtofilter){
                        console.log(stringtofilter);
                        item = dateAndTime()+"&"+stringToreplace;
                        edit[i].parentElement.childNodes[3].textContent = dateAndTime();
                        newArray.push(item);
                        let subArray =  JSON.parse(localStorage.getItem("SubTasks"));
                        subArray.forEach((subtask)=>{
                            if(subtask.includes(stringtofilter)){
                                subtask = subtask.replace(stringtofilter,stringToreplace);
                                newSubTaskArray.push(subtask); 
                            }
                            else{
                                newSubTaskArray.push(subtask);
                            }     
                        });

                    }else{
                        newArray.push(item);
                    }
                });
                localStorage.setItem("toDos" ,JSON.stringify(newArray) );   
                localStorage.setItem( "SubTasks" , JSON.stringify(newSubTaskArray));   
            }       
        }
    }
    emptyAlert(){
        if (this.name) {
            return this.name;
           }
          else{
            alert("You must write something!");
          }
        }
    createTextNode(inputValue){
        let newTexNode = document.createTextNode(inputValue);
        return newTexNode;
    }
    createElement(_element){
        let newelement = document.createElement(_element);
        return newelement;
    }
    getId(_id){
        let element = document.getElementById(_id);
        if(element){
            return element;
        }else{
            return "NOT-EXIST";
        }
    }
    getClass(_class){
        let result = document.getElementsByClassName(_class);
        return result;
    }
    storageRead(_arrayToRead){
        let tableFromStorage = localStorage.getItem(_arrayToRead);
        tableFromStorage = JSON.parse(tableFromStorage);
        return tableFromStorage;
    }
    readTodos(listtoread){ 
        if("toDos" in localStorage){
            var list = this.getId("myol");
            if(list.childNodes.length ==1){
                if(listtoread == 1){ 
                    let tablefromstorage = this.storageRead("toDos");
                    for (let i = 0; i < tablefromstorage.length; i++) { 
                        let endIndex = tablefromstorage[i].search("&");
                        let timeOfItem = tablefromstorage[i].substring(0,endIndex);
                        let itemValue = tablefromstorage[i].substring(endIndex+1);
                        this.createTodo(itemValue,timeOfItem,"R");
                    }
                    this.editTodo();
                    this.deletetodos();
                    this.toogleSubTasks(this.list);
                }
            } 
        } 
    }
    ifTodoExist(todoinput){
        let ArrayFromStorage = this.storageRead("toDos");
        if(ArrayFromStorage != null){
            ArrayFromStorage.forEach((item)=>{
                let endIndex = item.search("&");
                item = item.substring(endIndex+1);
                if(item == todoinput){      
                    todoinput = true;
                }  
            });
        }return todoinput;
      }
    createSubTask(mainTaskValue){
        let subAdd = document.getElementById("subTaskAdd");
        subAdd.addEventListener('click', (ev)=> {
            //let inputValue = ev.target.parentNode.parentNode.children[1].value;
            //ev.target.parentNode.parentNode.childNodes[1].value;
           let inputValue = document.getElementById("subInput").value;
           console.log(ev.target.parentElement.parentElement.parentElement);
            if(inputValue == "" || inputValue == null ){
               alert("SubTask input is empty");
            }
            else{
                let subTaskname = this.createTextNode(inputValue);
                let input = this.createElement("input");
                input.className ="subTasksDisplay";
                input.value = inputValue;
                input.readOnly = true;
                input.appendChild(subTaskname);
                document.getElementById("subTaskList").appendChild(input);  
                var mainTask =mainTaskValue;
                let subTaskInput = input.textContent;
                this.writeSubTask(subTaskInput+"#"+mainTask); 
                document.getElementById("subInput").value = "";    
            }   
        });  
        this.readSubTask(mainTaskValue);
        this.editSubTask();
    }
    writeSubTask(_subTaskInput){
        if("SubTasks" in localStorage){  
           let subArray =  JSON.parse(localStorage.getItem("SubTasks")); 
           subArray.push(dateAndTime()+"&"+_subTaskInput);
           localStorage.setItem( "SubTasks" , JSON.stringify(subArray));
           document.getElementsByClassName("subTasksDisplay").value = " ";
        }else{
            let SubTasks = [];
            SubTasks.push(dateAndTime()+"&"+_subTaskInput); 
            localStorage.setItem( "SubTasks" , JSON.stringify(SubTasks)); 
            document.getElementsByClassName("subTasksDisplay").value = " ";
        }  
    }
    readSubTask(subTaskID){  
      let subTasks = this.storageRead("SubTasks");
      if(subTasks){
        subTasks.forEach((subtask)=>{
            subtask = subtask.split("#");
            let id = subtask[1];
            subtask = subtask[0].split("&");
            let subTaskTimeStamp = subtask[0];
            let subTaskValue = subTaskTimeStamp+"|"+subtask[1];
            if(subTaskID == id){
                let input = this.createElement("input");
                // let TimeStamp = this.createElement("span");
                // TimeStamp.textContent = "subTaskTimeStamp";
                input.className ="subTasksDisplay";
                input.value = subTaskValue;
                input.readOnly = true;
                document.getElementById("subTaskList").appendChild(input);
            } 
        });
      }
    }
    editSubTask(){
        let input = document.querySelectorAll(".subTasksDisplay");
        input.forEach((subtask)=>{
            // subtask.ondblclick = (ev)=>{
                    // let  subTaskID =  ev.target.parentElement.parentElement.childNodes[0].textContent;
                    // console.log(document.getElementsByClassName("checked").textContent);
                    // var curentValue = ev.target.value;
                    // curentValue = curentValue.split("|");
                    // let editedSubTask = prompt("Edit SubTask :",curentValue[1]);
                    // let newtask = editedSubTask+"#"+subTaskID;
                    // this.writeSubTask(newtask);   
            // }
            subtask.onclick = (ev)=>{ 
                var temparray = ev.target.value.split("|");
                let target = temparray[1];
                let message = `${target} : Delete this SubTask ?`
                let result = confirm(message);
                if(result == true){
                        // subtask.readOnly = false;
                    var curentValue = ev.target.value;
                    //console.log("curentValue:",curentValue);
                    // let  subTaskID =  ev.target.parentElement.parentElement.childNodes[0].textContent;
                    let test = document.querySelectorAll(".checked");
                    let subTaskID = test[0].childNodes[0];
                    let subTasksfromStorage = this.storageRead("SubTasks");
                    let newSubTaskArray = [];
                    var targetTimeStamp = ev.target.value.split("|");
                    curentValue = targetTimeStamp[0];
                    let newSubTaskArray2 = [dateAndTime()+"&"+curentValue+"#"+subTaskID];
                    //console.log(targetTimeStamp);
                    subTasksfromStorage.forEach((subtask)=>{
                        let subtasksplited = subtask.split("&");
                        let timestamp = subtasksplited[0];
                        // console.log(timestamp);
                        subtasksplited = subtasksplited[1].split("#"); // subtasksplited[1] => extract the SubTask id  
                        if(!subtask.includes(curentValue) || !subtask.includes(targetTimeStamp[1])){ 
                        newSubTaskArray.push(subtask);   
                        } 
                        ev.target.remove();
                    });console.log("New Array :",newSubTaskArray.concat(newSubTaskArray2));
                    localStorage.setItem( "SubTasks" , JSON.stringify(newSubTaskArray));
                }else{
                    let  subTaskID =  ev.target.parentElement.parentElement.childNodes[0].textContent;
                    //console.log(document.getElementsByClassName("checked").textContent);
                    var curentValue = ev.target.value;
                    curentValue = curentValue.split("|");
                    let editedSubTask = prompt("Edit SubTask :",curentValue[1]);
                    if(editedSubTask == null || editedSubTask == ""){editedSubTask = curentValue[1]}
                   
                   // console.log(curentValue);
                    let newSubTaskArray = [];
                    let subArray =  JSON.parse(localStorage.getItem("SubTasks"));
                   
                    subArray.forEach((subtask)=>{
                        // let temp = subtask.split("&");
                        // let subTasktime = temp[0];
                        // console.log(subTasktime);
                        if(subtask.includes(curentValue[1]) && subtask.includes(subTaskID) && subtask.includes(curentValue[0])){
                            subtask = subtask.replace(curentValue[1],editedSubTask);
                            subtask = subtask.replace(curentValue[0],dateAndTime());
                            
                            newSubTaskArray.push(subtask); 
                        }
                        else{
                            newSubTaskArray.push(subtask); 
                        }
                    });
                    //let newtask = editedSubTask+"#"+subTaskID;
                   // this.writeSubTask(newtask);
                   localStorage.setItem( "SubTasks" , JSON.stringify(newSubTaskArray));
                } 
            }
               
        });
    }
    filerArray(_stringtoremove,src){
        let filteredTable = [];
        let objtable = [];
        if(src == 1){
            objtable = this.storageRead("toDos");
        }else{
            objtable = src;
            objtable = objtable.substring(0, objtable.length-29 );
            objtable = objtable.split();    
        }
        objtable.forEach((item)=>{
            let endIndex = item.search("&");
            let ItemValue = item.substring(endIndex+1);
            if(ItemValue !== _stringtoremove){ 
                filteredTable.push(item);  
            }
        });
    return filteredTable
    }
    storageWrite(_inputValue){
       if("toDos" in localStorage){
            let toDos = [];
            toDos = this.storageRead("toDos");
            toDos.push(dateAndTime()+"&"+_inputValue);
            localStorage.setItem( "toDos" , JSON.stringify(toDos));
            document.getElementById("myInput").value = "";    
        }else{
            let toDos = [];
            toDos.push(dateAndTime()+"&"+_inputValue); 
            localStorage.setItem( "toDos" , JSON.stringify(toDos)); 
            document.getElementById("myInput").value = "";    
        }       
    }
    createTodo(inputValue,timeOfItem,flag){
        let title = this.createTextNode(inputValue);
        let li = this.createElement("li");
        let span = this.createElement("span");
        let symbolX = this.createTextNode("Delete");
        span.className = "close";
        span.appendChild(symbolX);
        li.appendChild(title);
        li.appendChild(span);
        let spanedit = this.createElement("span");
        let editTextValue = this.createTextNode("Edit");
        spanedit.className = "edit";
        spanedit.appendChild(editTextValue);
        li.appendChild(spanedit);
        let timespan = this.createElement("span");
        let todoTime = this.createTextNode(timeOfItem);
        timespan.className = "time";
        timespan.appendChild(todoTime);
        li.appendChild(timespan);  
        if(flag == "R"){
            document.getElementById("myol").appendChild(li);
        }else if(flag == "W"){
            let checkiftrue = this.ifTodoExist(inputValue);
            if(checkiftrue != true){
                document.getElementById("myol").appendChild(li); 
                this.storageWrite(inputValue);
            }
        }    
    }
    deletetodos(){
        let close = document.querySelectorAll("span");
        close.forEach((item)=>{
            if(item.className == "close"){
                item.addEventListener('click', (ev)=> {
                    let spanContainer = ev.target.parentElement;
                    ev.target.parentElement.remove();
                    var stringtocomper = spanContainer.textContent;
                    stringtocomper = stringtocomper.substring(0, stringtocomper.length-29);
                    let filteredTable = this.filerArray(stringtocomper,1);
                    localStorage.setItem("toDos" ,JSON.stringify(filteredTable)); 
                    let subArray =  JSON.parse(localStorage.getItem("SubTasks"));
                    let newSubTaskArray = [];
                    subArray.forEach((subtask)=>{
                        if(!subtask.includes(stringtocomper)){
                            newSubTaskArray.push(subtask); 
                        }    
                    });localStorage.setItem( "SubTasks" , JSON.stringify(newSubTaskArray));
                });    
            }
        });
    }
}
function newtodo(){
    var todo = new Todo();  
    //location.reload();
    // console.log(todo);   
}
function dateAndTime(){
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();  
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    function checkforZero(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }
    month = checkforZero(month);
    day = checkforZero(day);
    minutes = checkforZero(minutes);
    seconds = checkforZero(seconds);
    let newtoday = day + '/' + month + '/' + yyyy;
    let time = hours + ':' + minutes + ':' + seconds;
    document.getElementById("date").innerHTML = newtoday;
    document.getElementById("time").innerHTML = time ; 
    t = setTimeout(()=> {
        dateAndTime()
      }, 100);
    return newtoday +" "+time;
}
dateAndTime();

