# Third & Fourth
There are various functions that are useful throughout the progam, and we provide access to them through two objects: `third` for scripts executed as part of the extension, and `fourth` for scripts injected into the page.

## Accessing Third/Fourth
The two objects are available in different ways. In order to access third, you must use an ES6 dynamic import like so:
```js
const src = browser.runtime.getURL("resource/third.js");
const third = await import(src).default;
```
Fourth is much easier to access -- in fact, any script injected via `third.InjectToggleableScripts()` will have access to it in the namespace by default, and otherwise they can be provided access to it by first running `third.InjectFourth`.

## Third API
`third.GetPath(path)`: Returns the URL injected script (any script in the `src/injected/` directory, given its location in said directory. Not usually useful to simple features.

`async third.InjectFourth(caller)`: Injects `fourth` into the DOM so that injected scripts can access it. Pass in the name of the file that it's being called from (sans .js) so that it can adjust the methods to the relevant page (e.g. in `src/js/answer.js`, `caller` should be `"answer"` so it can inject a different implementation of `fourth.UserId()` specific to the answer page).

`async third.InjectScript(path, options)`: Injects the script at `third.GetPath(path)` into the page. `options` is an object specifying additional features of the script. Currently, the only option is `noAsync`, which is `false` by default and disables `async` on the code block. Returns the `<script>` element that was created.

`async third.InjectToggleableScripts(scripts, caller)`: Like in `third.InjectFourth`, `caller` is the name of the current script. `scripts` is much more complicated:
- The keys are names of configuration keys. If the associated configuration option is enabled, then it uses the corresponding value to inject a script into the page. - The script can be specified in a few ways:
  1. as a string, like `path` in `third.InjectScript`
  2. as an object, like `options` in `third.InjectScript` but with an extra key called `name` to specify the file to injector
  3. as an array containing more of options 1 and 2, if multiple scripts need to be conditioned on the same configuration key.

`async third.GetSettings()`: Returns the current settings.

`third.GetUserID()`: Returns a Promise that returns the user ID.

`third.GetUserIDFromAnswerPage()` Returns the user ID, assuming that it is called while on https://twocansandstring.com/answer

### Third Injections
Injections using third can be performed with one of two functions: `InjectScript` and `InjectToggleableScripts`. The latter acts as a wrapper for the former, letting you inject scripts conditionally based on whether or not a setting is a specific value or not. In most cases `InjectToggleableScripts` is preferred. With these functions you can pass in options for each script, which support the following fields:

Field | Type | Description
--- | --- | ---
`useHead` | `boolean` | If set to true, the script will be inserted inside of the document's `head` tag; otherwise, it will be inserted inside of `body`.
`noAsync` | `boolean` | By default, scripts injected are asynchronous. Setting this to true removes the boolean attribute in the script element, disabling asynchronicity inside of the respective script.
`defer` | `boolean` | Adds a `defer` boolean attribute to the script element if set to true. You can read about what this does [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer).

The syntax of `InjectToggleableScripts` can look like this:

```js
third.InjectToggleableScripts({
  anotherSetting: "injectedScript.js",
  configurationSetting: { name: "injectedScriptTwo.js", useHead: true },
  yetAnotherSetting: [
    { name: "injectedScriptThree.js", defer: true },
    { name: "injectedScriptFour.js", noAsync: true }
  ]
}, "caller");
```

The first argument is an object where each key is the configuration option that controls whether the script is to be injected or not. **If the key's value is a string**, the script encased in strings is injected if the respective configuration option is enabled (injected scripts are in /src/injected/). **If the key's value is an object**, it acts the same as if it were a string, but it also takes into account any extra options passed alongside the `name` parameter. Finally, **if the key's value is an array**, it acts the same as if it were an object, but injects multiple of these scripts at once as part of the same setting.

## Fourth API

`fourth.enums` A promise that, when resolved, holds the enums object (defined in `src/resource/enums.js`)

`fourth.config()` A function which returns the stored configuration.

`fourth.UserId()` Returns the user's ID number.

### TCaS API Functions

`fourth.Request(fn)` Send a request to the Two Cans and String stitchservices API where `fn` is the name of a specific function following the format of [category].[function].

`fourth.GetUserToken()` Get the user's token if they are logged in if authentication is required. Should be used sparingly.

### Utility Functions

#### `fourth.Alert(title, content, buttons)`
Opens a popup box with optional buttons. **This returns a promise**, so if you are going to use it you must wait for the user to make an input before continuing further. Examples are shown below if you are confused. `buttons` is an array of JSON objects containing button data. Valid fields are:

Field | Type | Description | Example
--- | --- | --- | ---
`text` | `string` | The button's contents. Can contain HTML.
`color` | `string[]` | An array of two strings to use as the button's color. The color is a linear gradient, and the two elements of the array represent the stops. | `["#a00", "#800"]`
`callback` | `() => any` | A function to be called when the button is clicked. Any value returned is used to resolve the alert's promise. | `() => true`

The alert box has a close button on the top right. Clicking this causes the promise to return `false`.

An example of how to use this is as follows:

```js
fourth.Alert(
  "Important question",
  "Which food is better?",
  [
    {
      text: "Waffles",
      callback: () => "w"
    },
    {
      text: "Pancakes",
      callback: () => "p"
    }
  ]
).then(result => {
  if (result === "w") {
    fourth.Alert("Result", "Good."); // Buttons are optional.
  } else {
    fourth.Alert("Result", "Not good >:(.");
  }
})
```

`fourth.Confirm(title, content)` Creates an alert (see above) containing two buttons, one labeled "Yes" (returning `true`) and the other labeled "No" (returning `false`).