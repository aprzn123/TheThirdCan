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

## Fourth API

`fourth.enums` A promise that, when resolved, holds the enums object (defined in `src/resource/enums.js`)

`fourth.config()` A function which returns the stored configuration.

`fourth.UserId()` Returns the user's ID number.
