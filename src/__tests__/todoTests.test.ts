import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
} from "selenium-webdriver";
const chromedriver = require("chromedriver");

const driver: WebDriver = new Builder()
  .withCapabilities(Capabilities.chrome())
  .build();

class TodoPage {
  //I pulled what I did in firstTest.test.ts over here. 
  //I brainstormed what I may need for selectors and pulled additonal ones from the DOM
  // as well as referenced the solution for additional selectors. 
  todoInput: By = By.css("input[placeholder='What needs to be done?']");
  todos: By = By.css("li.todo");
  todoLabel: By = By.css("label");
  todoComplete: By = By.css("input[type='checkbox']");
  todoStar: By = By.className("star");
  starBanner: By = By.className("starred");
  todoCount: By = By.className("todo-count");
  clearCompletedButton: By = By.css("button.clear-completed");

  driver: WebDriver;

  url: string = "https://devmountain.github.io/qa_todos/";

  constructor(driver: WebDriver) {
    this.driver = driver;
  }
}
const tp = new TodoPage(driver);

describe("the todo app", () => {
  beforeEach(async () => {
    await driver.get(tp.url);
  });
  afterAll(async () => {
    await driver.quit();
  });
  it("can add a todo", async () => {
    //The line below is locating the "new-todo"s.
    await driver.wait(until.elementLocated(tp.todoInput));
    //The line below is finding the todo input bar and inputting "Test To-Do" and selecting enter.
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
  });
  it("can remove a todo", async () => {
    //The line below is finding existing todos
    let myTodos = await driver.findElements(tp.todos);
    //The line below is specifically searching out the input that was added in the previous test.
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
    //The two lines below are finding the check circle and marked the task complete by clicking it. 
      .findElement(tp.todoComplete)
      .click();
    //The line below is locating and selecting the clear completed button. 
    await (await driver.findElement(tp.clearCompletedButton)).click();
    //The lines below are looking for existing todos and ensuring that the "Test To Do" 
    //input has been removed. 
    myTodos = await driver.findElements(tp.todos);
    let myTodo = await myTodos.filter(async (todo) => {
      (await (await todo.findElement(tp.todoLabel)).getText()) == "Test To-Do";
    });
    expect(myTodo.length).toEqual(0);
  });
  it("can mark a todo with a star", async () => {
     //The first line is locating the input bar.
    await driver.wait(until.elementLocated(tp.todoInput));
     //The second line is gathering a count for how many tasks are currently starred.
    let startingStars = await (await driver.findElements(tp.starBanner)).length;
     //The third line is locating the input bar and entering "Test To-Do" to create a new task
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do\n");
     //The line below iocating existing todos
    await (await driver.findElements(tp.todos))
     //This lines below are finding the "Test To Do" task
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do";
      })[0]
     //The line below is locating the star icon.
      .findElement(tp.todoStar)
     //The line below is clicking the star icon. 
      .click();
     //The lines below are locating and comparing the counts for starting stars 
     //vs ending stars. 
    let endingStars = await (await driver.findElements(tp.starBanner)).length;
    expect(endingStars).toBeGreaterThan(startingStars);
  });
  it("has the right number of todos listed", async () => {
    // The first line is locating the input bar.
    await driver.wait(until.elementLocated(tp.todoInput));
    //The second line is getting an inital count for todo items.
    let startingTodoCount = await (await driver.findElements(tp.todos)).length;
    //The lines below are adding 3 new todos.
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 1\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 2\n");
    await driver.findElement(tp.todoInput).sendKeys("Test To-Do 3\n");
    //The lines below are gathering an end count for todo items.
    let endingTodoCount = await (await driver.findElements(tp.todos)).length;
    //The line below is generating a message for the count.
    let message = await (await driver.findElement(tp.todoCount)).getText();
    //This line let's the automation know that we are expecting the count to be 3.
    expect(endingTodoCount - startingTodoCount).toBe(3);
    //This line is further generating the message. 
    expect(message).toBe(`${endingTodoCount} items left`);
  });
  it("has the right number of todos listed after a task is marked complete", async () => {
    // The first line is locating the input bar.
    await driver.wait(until.elementLocated(tp.todoInput));
    //The second line is getting an inital count for todo items.
    let startingTodoCount = await (await driver.findElements(tp.todos)).length;
    //The line below is finding existing todos
    let myTodos = await driver.findElements(tp.todos);
    //The line below is specifically searching out "Test To-Do 1".
    await myTodos
      .filter(async (todo) => {
        (await (await todo.findElement(tp.todoLabel)).getText()) ==
          "Test To-Do 1";
      })[0]
     //The two lines below are finding the check circle and marked the "Test To-Do 1" 
     //complete by clicking it. 
      .findElement(tp.todoComplete)
      .click();
     //The line below is locating and selecting the clear completed button. 
    await (await driver.findElement(tp.clearCompletedButton)).click();
     //The lines below are gathering an end count for todo items.
    let endingTodoCount = await (await driver.findElements(tp.todos)).length;
     //The line below is generating a message for the count.
    let message = await (await driver.findElement(tp.todoCount)).getText();
     //This line let's the automation know that we are expecting the count to be 3.
    expect(endingTodoCount - startingTodoCount).toBe(-1);
     //This line is further generating the message. 
    expect(message).toBe(`${endingTodoCount} items left`);
  });
});