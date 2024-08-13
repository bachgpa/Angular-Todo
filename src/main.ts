import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Client, Databases } from 'appwrite';

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

var tasksList: any;

async function renderToDom(task: any) {
  const taskWrapper = `
  <div class="task-wrapper" id="task-${task.$id}">
    <p class="completed-${task.completed}">${task.body}</p>
    <strong class="delete" id="delete-${task.$id}">x</strong>
  </div>`;
  if (tasksList) {
    tasksList.insertAdjacentHTML('afterbegin', taskWrapper);
  }
  console.log(task.$id);
}

async function getTask() {
  const response = await db.listDocuments(DATABASE_ID, COLLECTION_ID_TASK);
  tasksList = document.getElementById('tasks-list');
  for (let i = 0; response.documents.length > i; i++) {
    renderToDom(response.documents[i]);
  }
}

getTask();
