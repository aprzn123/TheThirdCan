*(note: docs are a work in progress, be wary that there may be errors)*
# How to Add New Features
I would recommend reading through this document before implementing anything; following these instructions and matching them to pre-existing code is probably the most effective way to get started on this project. Note that there are possibilities beyond this, but this should get you up and running.

## Step 1: Set up config
There are two ways to configure features, either as an **enum** or as a **boolean**. Configure it as an enum if it needs configuration beyond on/off, otherwise use a boolean. 

0. Choose a name for the feature that will be used to reference it throughout the codebase. Here, we will call it `"yourFeature"`
1. Update `src/popup/config.html`. 
This differs significantly between enum and boolean configuration. For a *boolean*, add an `<input type="checkbox" id="yourFeature">` tag with the feature's name as the ID. For an *enum*, add a `<div id="yourFeature">` feature's name as the ID, and inside the div add several `<input type="radio">` with a `data-enumerated` attribute that corresponds to the enum values for each radio button. **Importantly, `data_enumerated="0"` should always be the option that disables the feature.**
2. Update `src/popup/config.js`
`config.js` contains an object named `tags`. If your feature is a *boolean*, add the name (`"yourFeature"`) to the `tags.boolTags` array. If it is an *enum*, add it to `tags.radioTags`.
3. Only if your feature is configured as an enum: update `src/resource/enums.js` to include values that correspond to the values of your enum. 

## Step 2: Implement the feature
Depending on the feature, it may be relevant only on one section of the site, or throughout. For your first feature, it is recommended to add it to a section of the site that already has a feature, so the base structure is set up. For the sake of example, let us imagine that you are adding a feature to the answer page.

1. Identify whether your feature will need to access the Javascript environment of the page or just the DOM.
	- In the former case, you will need to inject a script into the page
    - In the latter case, you can simply implement the functionality from the file in `src/js/` that corresponds to the page, e.g. `src/js/answer.js`

The paths diverge here:
### Normal Scripts
 In the relevant file in `src/js/`, write a function that takes `third` as an argument (see [Third & Fourth](docs/third_fourth.md), but in short `third` is a collection of utilities) and implements the functionality you need. Then, at the end of the immediately-called `async` function that should already be in the file, add an `if` statement like this one:
 ```js
 const cfg = await third.GetSettings();
 if (cfg.yourFeature) {
   callYourFeaturesFunctionHere(third);
 }
 ```
### Injected Scripts
`third` provides utilities that improve safety and efficiency when injecting scripts into the page. Begin by creating a new file in `src/injected/` for your feature. For safety, surround the entire file in a `{}` block (or an `(async () => { })();` block if it is an enum feature, for reasons that will become clear soon). 

Injected scripts are provided access to `fourth` (see [Third & Fourth](docs/third_fourth.md)). If your script is an enum script, access enum values and configuration through `fourth.config()` and `await fourth.enums`.

Now, to actually inject the script when the feature is enabled, go to the relevant `src/js/` file. It should contain a call to `third.InjectToggleableScripts()` with an object. To add your script, simply add an element to the object with the key being your configuration name (`yourFeature` in this example) and the value being the name of the file in `src/injected/`.

## Congratulations!
If you follow the steps listed here, your feature should be implemented into the extension. On to bigger and better things, *og mere til Javanissen!*
