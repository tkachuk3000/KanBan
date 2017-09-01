'use strict';
document.addEventListener('DOMContentLoaded',function(){
	var do_it =document.getElementById('do_it');
	var doing = document.getElementById('in_progress');
	var done = document.getElementById('done');
	var aborted = document.getElementById('aborted');
	var base_task =[]; // Список в который записываются все создающиеся задания

	function date_start(){
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();
		var hour = date.getHours();
		var min = date.getMinutes();
		var seconds = date.getSeconds();
		return 'Date: '+day+'.'+month+'.'+year+' time: '+hour+':'+min+':'+seconds;
	};
	
	function Task(){ //Прототип функции для хранения информации о задании.
		this.task;    //Экземпляры сохраняются в base_task
		this.priority;
		this.place;
		this.dateStart;
	};
	
		var button = document.getElementById('button');// Кнопка создания нового задания,
		button.addEventListener('click',displayTask);      // показывает форму для ввода
		var toggle = true;
	function displayTask(){
		if(toggle == true){
			form.style.display = 'block';
			toggle = false;
		}else{
			form.style.display = 'none';
			toggle = true;
		}
	};
	
	function localStorageRead(){
		for(var i = 0; i<localStorage.length; i++){
			var a = localStorage.getItem(i);
			var b = a.split(' &*& ');
			newObgectTask(b);
		};
		sort();
	};
	
	localStorageRead();

	function localStorageWrite(){
		localStorage.clear();
		for(var i = 0; i<base_task.length; i++){
			var result = base_task[i].task+' &*& '+base_task[i].priority+' &*& '+base_task[i].place+' &*& '+base_task[i].dateStart;
			localStorage.setItem(i, result);
			var a = localStorage.getItem(i);
		};
	};

		var button_form = form.elements.button_form;// Кнопка на форме создания задания
		button_form.addEventListener('click',form_read);
	function form_read(){
		event.preventDefault();
		var form = document.forms.form_for_task;
		var taskText = form.elements.task_text.value;
		var taskPriority = form.elements.task_priority.value;
		var arr = [taskText,taskPriority];
    	var newTask = newObgectTask(arr);
		sort();
		form.reset();
		form.style.display = 'none';
    };
	
	function newObgectTask(arrow){
		var n_Task = new Task();
		n_Task.task = arrow[0];
		n_Task.priority = arrow[1];
		if(arrow.length == 2){
			n_Task.place = 'do_it';
			n_Task.dateStart = date_start();
		}else{
			n_Task.place = arrow[2];
			n_Task.dateStart = arrow[3];
		};
		base_task.push(n_Task);
		return n_Task
	};
	
	var show_form_priority = true;
	function func_change_priority(){
		var div = this.parentElement;
		var form_priority = div.getElementsByClassName('form_priority')[0];
		if(show_form_priority == true){
			form_priority.style.display = 'block';
			show_form_priority = false;
		}else{
			form_priority.style.display = 'none';
			show_form_priority = true;
		};
	};

	function func_save_changed_priority(){
		event.preventDefault();
		var form = this.parentElement.parentElement.getElementsByClassName('form_priority')[0];

		for(var i = 0; i < base_task.length; i++){
			if(base_task[i].dateStart == this.parentElement.parentElement.lastElementChild.innerHTML){
				for(var j = 0; j<=4; j+=2){
					var check_input_radio = form.children[j].children.task_priority;
					if(check_input_radio.checked){
						base_task[i].priority = check_input_radio.value;
					};
				};
			};
		};
		sort();
	};

	function sort(){ //Сортировка запускается каждый раз когда происходит какое либо изменение на доске или с заданием
		do_it.innerHTML = null;
		doing.innerHTML = null;
		done.innerHTML = null;
		aborted.innerHTML = null;
		for(var i = 0; i<base_task.length; i++){
			if(base_task[i].priority =='hight'){
				createDivForTask(base_task[i]);
			};
		};
		for(var i = 0; i<base_task.length; i++){
			if(base_task[i].priority =='normal'){
				createDivForTask(base_task[i]);
			};
		}
		for(var i = 0; i<base_task.length; i++){	
			if(base_task[i].priority =='low'){
				createDivForTask(base_task[i]);
			};
		};
		localStorageWrite();
	};

	function func_aborted(){
		for(var i = 0; i < base_task.length; i++){
			if(base_task[i].dateStart == this.parentElement.lastElementChild.innerHTML){
				base_task[i].place = 'aborted';
			};
		};
		sort();
	};

	function createDivForTask(obg){// Создаёт <div> задания и вставляет его в одну из 4 колонок
		var div = document.createElement('div');
		div.classList.add('listTask');
		
		if(obg.place == 'done' || obg.place == 'aborted'){//Создаёт иконку для удаления из DONE и ABORTED
			var divRemove = document.createElement('div');
			divRemove.classList.add('removeDivTask');
			divRemove.innerHTML ='<div class="delete_1"></div><div class="delete_2"></div>';
			div.appendChild(divRemove);
			divRemove.addEventListener('click',del_obg_in_base);
			divRemove.addEventListener('click',function(){deleteFunc(this);});
		};

		if(obg.place == 'do_it' || obg.place == 'doing'){//Создаёт кнопку и меню для изменения приоритета задачи
			var button_change_priority = document.createElement('button');
			button_change_priority.innerText = 'Change priority';
			button_change_priority.classList.add('button_change_priority');
			div.appendChild(button_change_priority);
			button_change_priority.addEventListener('click',func_change_priority );
			
			var get_priority_input_html = document.getElementById('div_priority').innerHTML;
			var change_priority = document.createElement('form');
			change_priority.innerHTML = get_priority_input_html;
			change_priority.classList.add('form_priority');
			var button_save_new_prioriti = change_priority.getElementsByTagName('button')[0];
			button_save_new_prioriti.innerHTML = 'Save new';
			button_save_new_prioriti.classList.add('button_save_changed_priority');
			button_save_new_prioriti.addEventListener('click',func_save_changed_priority);
			
			button_change_priority.after(change_priority);

			var button_aborted = document.createElement('button');
			button_aborted.innerText = 'Aborted';
			button_aborted.classList.add('button_aborted');
			
			button_change_priority.after(button_aborted);
			button_aborted.addEventListener('click',func_aborted);  // function(){console.log(this);console.log('JJJ');}
			
		};

		var buttonLeft = document.createElement('button');
		buttonLeft.innerHTML ='<<';  //
		buttonLeft.classList.add('moveLeft');
		buttonLeft.addEventListener('click',funcMoveLeft);

		var buttonRight = document.createElement('button');
		buttonRight.innerHTML ='>>';  //&rArr;
		buttonRight.classList.add('moveRight');
		buttonRight.addEventListener('click',funcMoveRight);

		var fieldText = document.createElement('p');
		fieldText.innerHTML = obg.task;
		if(obg.place == 'do_it'){
			fieldText.addEventListener('blur',save_changed_task)
			fieldText.setAttribute('contenteditable','true');
		};
		fieldText.classList.add('field_task');
		
		var date = document.createElement('p');
		date.classList.add('date');
		date.innerHTML = obg.dateStart;

		div.appendChild(buttonLeft);
		div.appendChild(buttonRight);
		div.appendChild(fieldText,date);
		div.appendChild(date);

		switch(obg.priority){
			case 'hight':
				div.style.backgroundColor = '#fab6df';
				break;
			
			case 'normal':
				div.style.backgroundColor = '#f5f518';
				break;

			case 'low':
				div.style.backgroundColor = '#b0ffdb';
				break;
		};
		switch(obg.place){	
			case 'do_it':
				do_it.appendChild(div);
				break;
			
			case 'doing':
				doing.appendChild(div);
				break;
			
			case 'done':
				done.appendChild(div);
				break;
			
			case 'aborted':
				aborted.appendChild(div);
				break;
		};
	};

	
	
	function save_changed_task(){
		for(var i = 0; i < base_task.length; i++){
			if(base_task[i].dateStart == this.parentElement.lastElementChild.innerHTML){
				if(this.innerText !== base_task[i].task){
					base_task[i].task = this.innerText;
					for(var j = 0; j<localStorage.length; j++){
						if(i == j){
							localStorage[j] = this.innerText+' &*& '+base_task[i].priority+' &*& '+base_task[i].place+' &*& '+base_task[i].dateStart ;
						};
					};
				};
			};
		};
	};

	function deleteFunc(that){
		that.parentElement.parentElement.removeChild(that.parentElement);
		sort();
	};

	function del_obg_in_base(){  //Удаляет из списка - base_task объект хранящий информацию о задании
		for(var i = 0; i < base_task.length; i++){
			if(base_task[i].dateStart == this.parentElement.lastElementChild.innerHTML){
				base_task.splice(i,1);
			};
		};
	};

	function funcMoveRight(){
		for(var i = 0; i < base_task.length; i++){
			if(base_task[i].dateStart == this.parentElement.lastElementChild.innerHTML){
			switch(base_task[i].place){
					case 'do_it':
					    var reWriteTask = this.parentElement.getElementsByClassName('field_task')[0];
						if(reWriteTask){
							base_task[i].task = reWriteTask.innerHTML;
						};
					//  reWriteTask нужен что бы редактировать текст задания в DO IT						
						base_task[i].place = 'doing';
						sort();
						break;
			
					case 'doing':
						base_task[i].place = 'done';
						sort();
						break;
				
					case 'done':
						base_task[i].place = 'aborted';
						sort();
						break;
			
					default:
					alert("Отсюда только влево или удалить");
				};
			};		
		};
	};
	
	function funcMoveLeft(){
		for(var i = 0; i < base_task.length; i++){
			if(base_task[i].dateStart == this.parentElement.lastElementChild.innerHTML){
				switch(base_task[i].place){
					case 'aborted':                
						base_task[i].place = 'done';
						sort();
						break;
			
					case 'done':
						base_task[i].place = 'doing';
						sort();
						break;
				
					case 'doing':
						base_task[i].place = 'do_it' ;
						sort();
						break;
			
					default:
					alert("Отсюда только вправо");
				};
			};		
		};
	};
});