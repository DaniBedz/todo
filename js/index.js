// Select the New Task Form
// const newTaskForm = document.querySelector('#newTaskForm');
const newTaskForm = document.querySelector('#taskContainer');

// Add an 'onsubmit' event listener
newTaskForm.addEventListener('submit', (event) => {
// Prevent default action of browswer refreshing
  event.preventDefault();
});
  
function isValidTaskInput(data) {
  return data !== null && data !== '';
}
function isValidDateInput(data) {
  return /\w\w\w\s\d\d.\d\d.\d\d/i.test(data);
}

function addDescriptionHtml()
{
  $('.description button').on('click', function () {
    $(this).parent().parent().find('div.descriptionDiv').toggle();
    }
   )
}

function renderTask(taskId,taskName) {
  $('#mainContainer')
      .append($([
          '<div class= "card row mx-auto text-center" id='+taskId +'>',
          '<div class="col">',
          ' <div class="row bg-dark mx-n3 pt-3">',
          '  <div class="col-1 bg-dark">',
          '<div class="form-group">',
          ' <label for="type'+taskId+'">Type</label>',
          ' <select id="type'+taskId+'" class="selectpicker mr-n3" data-width="fit">',
          '     <option class="bg-dark" value="none"',
          '       data-content="<span class=\'btn btn-outline-primary btn-shrink btn-none\'>None</span>">None',
          '   </option>',
          '  <option class="bg-dark" value="work"',
          '      data-content="<span class=\'btn btn-outline-primary btn-shrink btn-none\'>Work</span>">Work',
          '  </option>',
          '  <option class="bg-dark" value="leisure"',
          '      data-content="<span class=\'btn btn-outline-primary btn-shrink btn-none\'>Play</span>">',
          '      Leisure</option>',
          '  <option class="bg-dark" value="other"',
          '       data-content="<span class=\'btn btn-outline-primary btn-shrink btn-none\'>Other</span>">Other',
          '  </option>',
          ' </select>',
          ' </div>',
          ' </div>',

           '   <div class="col-5 bg-dark p-desc description">',
         '                       <div class="input-group">',
           '                           <label for="desc'+taskId+'">Task/Description</label>',
           '                           <input id="desc'+taskId+'" type="text" class="form-control bg-dark text-white input rounded mr-n2 task-desc cardTag" placeholder="Type Task Name here..." value="'+taskName+'">',
           '<button id="btn-description" type="button"',
           ' class="more text-white px-3 py-2 rounded">...</button>',
           '     </div>',
           '<div class="descriptionDiv" style="display: none">',
          '<input id="description1" type="text" class="form-control bg-dark text-white input rounded task-desc cardTag" placeholder="Description..">',,
           '</div>',
           '                       </div>',
           '     <div class="col-1 bg-dark text-center">',
           '                           <div class="form-group">',
           '                               <label for="assigned'+taskId+'">Assigned</label>',
           '                               <select id="assigned'+taskId+'" class="bg-dark selectpicker text-center mr-n3" data-width="fit">',
           '                                   <option class="bg-dark" value="none"',
           '                                       data-content="<span class=\'btn btn-outline-primary btn-shrink btn-none\'>&nbsp;None&nbsp;</span>">None',
           '         </option>',
           '                                   <option class="bg-dark" value="victoria"',
           '                                       data-content="<span class=\'btn btn-victoria btn-shrink\'>&nbsp;Victoria&nbsp;</span>">Victoria',
           '         </option>',
           '                                   <option class="bg-dark" value="dani"',
           '                                       data-content="<span class=\'btn btn-dani btn-shrink\'>&nbsp;&nbsp;&nbsp;Dani&nbsp;&nbsp;&nbsp;</span>">Dani',
           '         </option>',
           '                               </select>',
           '                           </div>',
           '                       </div>',


           ' <div class="col-1 bg-dark">',
           '                       <div class="form-group">',
           '                            <label for="priority'+taskId+'">Priority</label>',
           '                            <select id="priority'+taskId+'" class="bg-dark selectpicker mr-n3" data-width="fit">',
           '                                <option class="bg-dark" value="none"',
           '                                    data-content="<span class=\'btn btn-outline-primary btn-shrink btn-none\'>&nbsp;None&nbsp;</span>">None',
           '      </option>',
           '                                <option class="bg-dark" value="low"',
           '                                   data-content="<span class=\'btn btn-success btn-shrink\'>&nbsp;&nbsp;&nbsp;Low&nbsp;&nbsp;&nbsp;</span>">Low',
           '     </option>',
           '                               <option class="bg-dark" value="medium"',
           '                                    data-content="<span class=\'btn btn-warning btn-shrink\'>&nbsp;Medium&nbsp;</span>">Medium',
           '     </option>',
           '                               <option class="bg-dark" value="high"',
           '                                   data-content="<span class=\'btn btn-danger btn-shrink\'>&nbsp;&nbsp;&nbsp;High&nbsp;&nbsp;&nbsp;</span>">',
           '                                   High</option>',
           '                           </select>',
           '                       </div>',
           '                   </div>',


           ' <div class="col-1 bg-dark">',
           '                         <div class="form-group">',
           '                             <label for="status'+taskId+'">Status</label>',
           '                             <select id="status'+taskId+'" class="bg-dark selectpicker mr-n3" data-width="fit">',
           '                                 <option class="bg-dark" value="none"',
           '                                     data-content="<span class=\'btn btn-outline-primary btn-shrink btn-none\'>&nbsp;None&nbsp;</span>">None',
           '       </option>',
           '                                 <option class="bg-dark" value="not-started"',
           '                                     data-content="<span class=\'btn btn-danger btn-status btn-shrink btn-wider\'>Not Started</span>">',
           '                                     Not',
           '         Started</option>',
           '                                 <option class="bg-dark" value="in-progress"',
           '                                     data-content="<span class=\'btn btn-warning btn-status btn-shrink btn-wider\'>In Progress</span>">',
           '                                     In',
           '         Progress</option>',
           '                                 <option class="bg-dark" value="completed"',
           '                                     data-content="<span class=\'btn btn-success btn-status btn-shrink\'>&nbsp;&nbsp;&nbsp;Done&nbsp;&nbsp;&nbsp;</span>">',
           '                                     Completed</option>',
           '                             </select>',
           '                        </div>',
           '                     </div>',

           '<div class="col-2 bg-dark text-white">',
           '                       <div class="form-group">',
           '                            <label for="date'+taskId+'">Due Date</label>',
           '                            <input id="date'+taskId+'" placeholder="&#xf271;"',
           '                                class="date bg-dark text-white text-center rounded border-0 date py-2" type="text">',
           '  </div>',
           '                        </div>',

           ' <div class="col-1 bg-dark">',
           '                             <div class="form-group">',
           '                                 <label for="delete1">Delete</label>',
           '                                 <a id="delete1" class="bin" onclick="deleteTask('+taskId+')">&#xf2ed;</a>',
           '                             </div>',
           '                        </div>',
           '                   </div > ',
           '               </div > ',
           '          </div > ',
           '          </div > '

      ].join("\n"))
      );

}

$(document).ready(function () {
  let taskManager1 = new taskManager();
  let $newTask = $('#newTaskNameInput');
  let taskId=taskManager1.createTask('none', $newTask.val(), 'none', 'none', 'none', 'none', null);
  renderTask(taskId,$newTask.val());

  $('#btn-add-task').on("click", function () {
    let emptyTask = false;
    if ($newTask.val().length > 1) {
      let tasks = $('input.cardTag');
      for (let i = 0; i < tasks.length; i++) {
        if ($(tasks[i]).val() == '') {
          emptyTask = true;
          break;
        }
      }
      //change this condition to only false for 
      if (emptyTask == false || emptyTask == true) {
        $('#alertMessage').hide();
                  
        let taskId=taskManager1.createTask('none', $newTask.val(), 'none', 'none', 'none', 'none', null);
        renderTask(taskId,$newTask.val());
        $('#'+taskId+' .description button').on('click', function () {
          $(this).parent().parent().find('div.descriptionDiv').toggle();
          }
         )

        $newTask.val("");
        $('select').selectpicker();
        getCalendar();
        
        
      }
      else {
        $('#alertMessage').text('Please use the empty slots provided')
          .show();
      }
    }
    else {
      $('#alertMessage').show();
    }
    
  });
 
  addDescriptionHtml();
  
});
