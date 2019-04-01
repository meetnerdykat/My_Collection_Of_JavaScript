// Define UI Variables
const form = document.querySelector('#task-form');
const newTaskInputField = document.querySelector('#task');
const taskListCollection = document.querySelector('.collection');
const clearTheFilter = document.querySelector('#filter');
const clearTasksBtn = document.querySelector('.clear-tasks');

/*
We're going to need a submit button on the task form, but instead of putting 
it in the global scope, we're going to call a funtion that will
LOAD ALL EVENT LISTENERS
*/

// calls the function
loadEventListners();

// LOADEVENTLISTENERS FUNCTION STARTS HERE
function loadEventListners() {
  // DOM Load event - FUNCTION GETTASKS at close of loadEventListners
  document.addEventListener('DOMContentLoaded', getTasks);

  // Add task event - The actual function is created around line 34
  form.addEventListener('submit', addTask);

  /*
  Part Two of this 3 part project starts here, inside the
  loadEventListeners funtion. We will be using Event Delegation
  here, meaning we're going to put the event listener onto the 
  Task List itself, onto the UL
  */

  // Remove task event - This provides the option to click on the delete icon and delete one task at a time - The actual function is created around line 92
  taskListCollection.addEventListener('click', removeTask);

  // Clear tasks event - This provides the option to clear all the tasks currently displayed in the Tasks List, all at once. - The actual function is created around line 104
  clearTasksBtn.addEventListener('click', clearTasks);

  // Filter tasks event - The actual function is created around line 104
  clearTheFilter.addEventListener('keyup', filterTasks);
}

// GETTASKS FUNCTION STARTS HERE - Get tasks from local storage
function getTasks() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function(task) {
    // Create li element
    const li = document.createElement('li');
    // Add class
    li.className = 'collection-item';
    // Create text node and append to li
    li.appendChild(document.createTextNode(task));
    // Create new link element
    const link = document.createElement('a');
    // Add class
    link.className = 'delete-item secondary-content';
    // Add icon html
    link.innerHTML = '<i class="far fa-trash-alt"></i>';
    // Append the link to the li
    li.appendChild(link);
    // Append the li to the ul
    taskListCollection.appendChild(li);
  });
}

// ADD TASK FUNCTION STARTS HERE
function addTask(e) {
  // REMIND user to add a task
  if (newTaskInputField.value === '') {
    alert('ADD A TASK PLEASE!');
  }

  /*
  Next, what do we want to happen when a user adds a task?
  We want to create a list item of course!
  */

  // Create li element from scratch
  const li = document.createElement('li');

  /*
  Next, we want to add a class because in Materialize, we have to add a 
  class to the list-item as well so we can make it look nice.
  We're adding that class using JS instead of HTML...Kathy-make sure to 
  look up the reason for this
  */

  // Add class to li collection item
  li.className = 'collection-item';

  // Create text node and append (add/attach/usually to the end) to the li
  // Inside the createTextNode parentheses, we want to put whatever's being
  // passed into the New Task input field
  li.appendChild(document.createTextNode(newTaskInputField.value));

  // Next, create a new link element, b/c we're going to implement deletion
  // ability.
  // Delete link element
  const link = document.createElement('a');

  // Add class to link element for same reason as above on lines 39 - 42
  // secondary-content class is Materialize specific, list items require it
  link.className = 'delete-item secondary-content';

  // Add icon html
  link.innerHTML = '<i class="far fa-trash-alt"></i>';

  // Append the link to the li
  li.appendChild(link);

  // Append the li to the ul
  taskListCollection.appendChild(li);

  /*
  // STORAGE IN LOCAL STORAGE
  Part Three of this 3-part project starts here. This is the part where I incorporate local storage.
  */
  storeTasksInLocalStorage(newTaskInputField.value);

  // Clear the input after the button has been clicked
  newTaskInputField.value = '';

  // Prevent default behavior of form being submitted
  // ALERT! I made a mistake here and spent about 8 minutes trying to figure it
  // out. The mistake I made was forgetting to add the word Default to the
  // method below  /:[
  e.preventDefault();
}

// STORE TASKS FUNCTION STARTS HERE
function storeTasksInLocalStorage(task) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// REMOVE TASK FUNCTION STARTS HERE, this function is created to specifically target the trash can icon and use it as the sole means of deleting a task. So in JS terms, we need to target that element and the function below is how I will achieve that goal. To start, I will need to create an if statement that targets the a tag inside the li element, but comes before the icon.
function removeTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    // Confirm to the user that task has been deleted by displaying a message that says that
    if (confirm('Are you sure? This cannot be undone...')) {
      // Target the i tag thats inside the a tag thats inside the li tag
      e.target.parentElement.parentElement.remove();

      // REMOVE FROM LOCAL STORAGE
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
    }
  }
}

// REMOVE FROM LOCAL STORAGE FUNCTION STARTS HERE
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function(task, index) {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// CLEAR TASKS FUNCTION STARTS HERE
// Clear Tasks Function - Way 1 - with innerHTML
// function clearTasks() {
//   taskListCollection.innerHTML = '';
// }

// Clear Tasks Function *FASTER* - Way 2 - with looping thru and calling removeChild
function clearTasks() {
  while (taskListCollection.firstChild) {
    taskListCollection.removeChild(taskListCollection.firstChild);
  }

  // CLEAR TASKS FROM LOCAL STORAGE CALL STARTS HERE
  clearTasksFromLocalStorage();
}

// CLEAR TASKS FROM LOCAL STORAGE FUNCTION STARTS HERE
function clearTasksFromLocalStorage() {
  localStorage.clear();
}

// FILTER TASKS FUNCTION STARTS HERE
function filterTasks(e) {
  // get the typed input by creating a variable
  // toLowerCase added at the end in order to keep consistency while matching
  const text = e.target.value.toLowerCase();

  // get all of the list items so that when user filters they have access to everything which makes it possible to filter effectively... we can use querySelectorAll in this case because it returns a node list as to where if we used getElementsByClass, it would return a class, which we'd then have to create an array for the class and loop through that newly created array. But since querySelectorAll returns a comlete node list, its simpler and faster to do it this way and use the forEach loop on it.
  document.querySelectorAll('.collection-item').forEach(function(task) {
    const item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}
