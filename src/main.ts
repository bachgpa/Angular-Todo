import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Client, Databases, ID } from 'appwrite';

const client = new Client();
const DATABASE_ID = '66b8e8d80024e6c4011c';
const COLLECTION_ID_TASK = '66b8e941001f44fd9f8a';

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66b6ff5300225bb2eebf');
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

const db = new Databases(client);

var form: any;
var formInput: any;

async function renderToDom(task: any) {
  const tasksList = document.getElementById('tasks-list') as HTMLElement;
  const taskWrapper = `
  <div class="task-wrapper" id="task-${task.$id}">
    <p class="complete-${task.completed}">${task.body}</p>
    <strong class="delete" id="delete-${task.$id}">x</strong>
  </div>`;
  if (tasksList) {
    tasksList.insertAdjacentHTML('afterbegin', taskWrapper);
  }

  const deleteBtn = document.getElementById(
    `delete-${task.$id}`
  ) as HTMLElement;

  const wrapper = document.getElementById(`task-${task.$id}`) as HTMLElement;

  deleteBtn.addEventListener('click', () => {
    db.deleteDocument(DATABASE_ID, COLLECTION_ID_TASK, task.$id);
    console.log(deleteBtn);
    wrapper.remove();
  });

  wrapper.childNodes[1].addEventListener('click', async (e: Event) => {
    task.completed = !task.completed;
    const target = e.target as HTMLElement;
    target.className = `complete-${task.completed}`;
    db.updateDocument(DATABASE_ID, COLLECTION_ID_TASK, task.$id, {
      completed: task.completed,
    });
  });
}

async function addTask(event: Event) {
  event.preventDefault();
  const taskBody = formInput.value;
  if (taskBody == '') {
    alert('task cannot be empty!');
    return;
  }
  const response = await db.createDocument(
    DATABASE_ID,
    COLLECTION_ID_TASK,
    ID.unique(),
    { body: taskBody }
  );
  renderToDom(response);
  form.reset();
}

async function getTask() {
  const response = await db.listDocuments(DATABASE_ID, COLLECTION_ID_TASK);
  form = document.getElementById('form') as HTMLElement;
  formInput = form.elements.namedItem('body') as HTMLInputElement;

  form.addEventListener('submit', addTask);
  for (let i = 0; response.documents.length > i; i++) {
    renderToDom(response.documents[i]);
  }
}

getTask();
