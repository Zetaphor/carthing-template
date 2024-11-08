import { default as ButtonHelper, Button, EventType } from './buttonHelper.ts';

/* We need to connect to the internal websocket, else the cat thing kills the webview */
const socket = new WebSocket('ws://localhost:8800');

const content = document.getElementById('content') as HTMLDivElement;

// Add a function to safely send websocket messages
// deno-lint-ignore no-explicit-any
function sendWebSocketMessage(message: any): void {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket is not connected. Current state:', socket.readyState);
    setTimeout(() => sendWebSocketMessage(message), 100);
  }
}

// Initialize button helper
const buttonHelper = new ButtonHelper();

// Button 1 listeners
buttonHelper.addListener(Button.BUTTON_1, EventType.Down, () => {
  console.log('Button 1: Down');
});
buttonHelper.addListener(Button.BUTTON_1, EventType.Up, () => {
  console.log('Button 1: Up');
});
buttonHelper.addListener(Button.BUTTON_1, EventType.Long, () => {
  console.log('Button 1: Long Press');
});
buttonHelper.addListener(Button.BUTTON_1, EventType.Short, () => {
  console.log('Button 1: Short Press');
});

// Button 2 listeners
buttonHelper.addListener(Button.BUTTON_2, EventType.Down, () => {
  console.log('Button 2: Down');
});
buttonHelper.addListener(Button.BUTTON_2, EventType.Up, () => {
  console.log('Button 2: Up');
});
buttonHelper.addListener(Button.BUTTON_2, EventType.Long, () => {
  console.log('Button 2: Long Press');
});
buttonHelper.addListener(Button.BUTTON_2, EventType.Short, () => {
  console.log('Button 2: Short Press');
});

// Button 3 listeners
buttonHelper.addListener(Button.BUTTON_3, EventType.Down, () => {
  console.log('Button 3: Down');
});
buttonHelper.addListener(Button.BUTTON_3, EventType.Up, () => {
  console.log('Button 3: Up');
});
buttonHelper.addListener(Button.BUTTON_3, EventType.Long, () => {
  console.log('Button 3: Long Press');
});
buttonHelper.addListener(Button.BUTTON_3, EventType.Short, () => {
  console.log('Button 3: Short Press');
});

// Button 4 listeners
buttonHelper.addListener(Button.BUTTON_4, EventType.Down, () => {
  console.log('Button 4: Down');
});
buttonHelper.addListener(Button.BUTTON_4, EventType.Up, () => {
  console.log('Button 4: Up');
});
buttonHelper.addListener(Button.BUTTON_4, EventType.Long, () => {
  console.log('Button 4: Long Press');
});
buttonHelper.addListener(Button.BUTTON_4, EventType.Short, () => {
  console.log('Button 4: Short Press');
});

// Button 5 listeners
buttonHelper.addListener(Button.BUTTON_5, EventType.Down, () => {
  console.log('Button 5: Down');
});
buttonHelper.addListener(Button.BUTTON_5, EventType.Up, () => {
  console.log('Button 5: Up');
});
buttonHelper.addListener(Button.BUTTON_5, EventType.Long, () => {
  console.log('Button 5: Long Press');
});
buttonHelper.addListener(Button.BUTTON_5, EventType.Short, () => {
  console.log('Button 5: Short Press');
});

// Scroll Press listeners
buttonHelper.addListener(Button.SCROLL_PRESS, EventType.Down, () => {
  console.log('Scroll Press: Down');
});
buttonHelper.addListener(Button.SCROLL_PRESS, EventType.Up, () => {
  console.log('Scroll Press: Up');
});
buttonHelper.addListener(Button.SCROLL_PRESS, EventType.Long, () => {
  console.log('Scroll Press: Long Press');
});
buttonHelper.addListener(Button.SCROLL_PRESS, EventType.Short, () => {
  console.log('Scroll Press: Short Press');
});

// Front Button listeners (keeping your existing ones)
buttonHelper.addListener(Button.FRONT_BUTTON, EventType.Down, () => {
  console.log('Front Button: Down');
});
buttonHelper.addListener(Button.FRONT_BUTTON, EventType.Up, () => {
  console.log('Front Button: Up');
});
buttonHelper.addListener(Button.FRONT_BUTTON, EventType.Long, () => {
  console.log('Front Button: Long Press');
});
buttonHelper.addListener(Button.FRONT_BUTTON, EventType.Short, () => {
  console.log('Front Button: Short Press');
});

// Scroll Left/Right only emit Short events
buttonHelper.addListener(Button.SCROLL_LEFT, EventType.Short, () => {
  console.log('Scroll Left');
});
buttonHelper.addListener(Button.SCROLL_RIGHT, EventType.Short, () => {
  console.log('Scroll Right');
});

// Keep the time display function
function setTime(): void {
  const time = new Date().toISOString();
  content.innerHTML = `Huzzah!<p/>The current time is ${time}`;
  setTimeout(setTime, 100);
}

setTime();