## Script Kit Pro Tutorials

<!-- description: Watch and read official tutorials -->
<!-- value: cli/tutorials.js -->
<!-- enter: Open scriptkit.com -->

<div class="flex flex-row w-full items-start">
<div class="flex-1">
<p>Visit <a href="https://scriptkit.com/tutorials">https://scriptkit.com/tutorials</a> to view the
official Script Kit tutorials created by John Lindquist.</p>

<p>These lessons will take your scripting skills to the next level. Unlocking countless possibilities with scripts, AI, and more! 🚀</p>
</div>
<img class="my-0 p-0 object-contain w-1/3" src="https://www.scriptkit.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fbadass-courses%2Fimage%2Fupload%2Fv1683624377%2Fplaceholder-tutorial-illustration-sk_2x_thb8g3.png&w=256&q=100">
<div>

## Get Help on Github Discussions

<!-- description: Post a question to Script Kit GitHub discussions -->
<!-- value: cli/get-help.js -->

The Script Kit community lives on GitHub discussions.

This is the place to:

- 🥰 &ensp;[Share scripts](https://github.com/johnlindquist/kit/discussions/categories/share)
- 🙏 &ensp;[Ask questions](https://github.com/johnlindquist/kit/discussions/categories/q-a)
- 💡 &ensp;[Discuss ideas](https://github.com/johnlindquist/kit/discussions/categories/ideas)
- 😱 &ensp;[Report errors](https://github.com/johnlindquist/kit/discussions/categories/error)

Or just hit _Enter_ to browse all.

> We'll do our best to respond ASAP!
      
## Subscribe to the Newsletter

<!-- description: Receive a newsletter with examples and tips -->
<!-- value: cli/join.js -->
<!-- enter: Subscribe -->

- Featured Scripts
- Latest Updates
- Tutorials and lessons
- Script Kit Tips and Tricks
- Curated dev news
      
## FAQ

<!-- description: Frequently asked questions -->
<!-- value: cli/faq.js -->
<!-- enter: Discuss on GitHub -->

### What is Script Kit?

Script Kit is an open-source dev tool for creating, running, editing, and sharing scripts.

These scripts can run in the Kit.app, the Terminal, GitHub actions, package.json scripts, webhooks, or pretty much anywhere.

### Community of Scripters?

The main goal of Script Kit is to build a community of people who love to script away the frictions of their day! 🥰

### What are Kit.app, kit, and kenvs?

- Kit.app - The Kit.app provides a UI for your scripts. The app is "script-driven" meaning that every time you launch the app, you're really launching a script. The main menu, even though complex, is a script you could write.

- kit - "kit" is the sdk of Script Kit

  - A bundle of JavaScript common libs wrapped by an API to make writing scripts easier (`get`, `download`, `replace`, `outputFile`, etc)
  - APIs for interacting with your OS (`edit`, `focusTab`, `say`, `notify`, etc)
  - APIs for interacting with Kit.app and Terminal (`arg`, `env`, etc)
  - Scripts and utils for app setup, managing kenvs, parsing scripts, etc

- kenvs - Kit Enviroments (AKA "kenv") are directories that contain a "scripts" directory. If you point "kit" at a "kenv", kit will parse the scripts and give you tools to simplify running and managing them.

      
## View Scheduled Scripts

<!-- description: View and edit upcoming jobs -->
<!-- value: cli/schedule.js -->
<!-- enter: Open Schedule -->

Use cron syntax to run scripts on a schedule:

```js
// Schedule: */10 * * * * *
```

> Note: these scripts must not include `arg` or they will time out after 10 seconds

      
## View System Event Scripts

<!-- description: View and edit system event scripts -->
<!-- value: cli/system-events.js -->
<!-- enter: Open System Events -->

This menu shows scripts that run on system events.

Add the `System` metadata to run your script on a system event

```js
// System: unlock-screen
```

Available events:

- suspend
- resume
- on-ac
- on-battery
- shutdown
- lock-screen
- unlock-screen
- user-did-become-active
- user-did-resign-active
- Read about the available events [here](https://www.electronjs.org/docs/latest/api/power-monitor#events)

> Note: YMMV based on your specific machine setup.
      
## Manage Kenvs

<!-- description: Manage Kit Environments -->
<!-- value: cli/kenv-manage.js -->
<!-- enter: Manage -->

A "kenv" (Kit Environment) is a directory with a `scripts` directory. This is the place to create a kenv to manage scripts for your dev team or projects that expose APIs (GitHub, Vercel, etc). We'll be releasing official Script Kit kenvs in the future to show off some of the best practices. 👍

Clone, create new, link, push, pull, remove. This menu allows you to manage any of the kenvs you've added to your machine.



      
## Add ~/.kit/bin to $PATH

<!-- description: Select profile and append ~/.kit/bin to $PATH -->
<!-- value: cli/add-kit-to-profile.js -->
<!-- enter: Select Profile -->

> This is similar to VS Code's "Add `code` to path"

You can run the `kit` CLI from your terminal with

```bash
~/.kit/bin/kit
```

but this option will allow you run the CLI with:

```bash
kit
```

> If you're familiar with adding to your `.zshrc`, just add `~/.kit/bin` to your PATH.

The `kit` CLI will allow you to run, edit, etc scripts from your terminal.

## Move .kenv Parent Directory

<!-- description: Move .kenv from "home" -->
<!-- value: cli/kenv-change-dir.js -->
<!-- enter: Select Parent Directory -->

By default, your ".kenv" is store in your system's home directory.

If you'd like to move it to ~/.config/.kenv or somewhere else, press Enter then select a new parent directory.
      
## Add kenv Executables to $PATH

<!-- description: Select profile and append ~/.kenv/bin to $PATH -->
<!-- value: cli/add-kenv-to-profile.js -->
<!-- enter: Select Kenv -->

Each time you create a script, Script Kit also generates a command based on the name you can run from the terminal.

If you create a script named `list-downloads`, then Script Kit creates a `~/.kenv/bin/list-downloads` executable.

Then you can run the command like so in the terminal:

```bash
~/.kenv/bin/list-downloads
```

This will walk you through running the command without the full path:

```bash
list-downloads
```

## Theme Selector

Select from a variety of themes. Mostly a work in progress. We'll support community themes in the future. ❤️

<!-- description: Preview Themes -->
<!-- value: pro/theme-selector.js -->
<!-- enter: Open Theme Selector -->

      
## Change Script Kit Shortcut

<!-- description: Change the shortcut to open Script Kit -->
<!-- value: cli/change-main-shortcut.js -->
<!-- enter: Change -->

Don't like `cmd+;`? Change it here!
      
## Add/Change a Script Shortcut

<!-- description: List scripts with shortcuts, then prompt to change -->
<!-- value: cli/change-shortcut.js -->
<!-- enter: List Scripts -->

This list all the scripts and allows you to add a shortcut to it.

You can manually add shortcuts to scripts like so:

```js
// Shortcut: cmd option g
```

This menu will manage that for you
      
## Generate bin Files

<!-- description: Recreate all the terminal executables -->
<!-- value: cli/create-all-bins.js -->
<!-- enter: Create bins -->

If you manually manage files in the `scripts` dir (instead of using Kit.app or the `kit` CLI) you may run into the scenarios where you have to re-generate all the `bin` executables. This will do that for you.

      
## Change Editor

<!-- description: Change the editor used to open scripts -->
<!-- value: cli/change-editor.js -->
<!-- enter: Select -->

This will re-prompt you to pick an editor from your PATH by updating your kenv `.env`.

You can always manually change the editor that Script Kit uses to open files in `~/.kenv/.env`.

The following would use `code` (assuming is on the "PATH").

```bash
KIT_EDITOR=code
```

If `code` isn't on your PATH, you can add the full path to the editor.
      
## Clear Kit Prompt Cache

<!-- description: Clear the positions and sizes of script prompts -->
<!-- value: cli/kit-clear-prompt.js -->
<!-- enter: Clear Cache -->


Each time you move or resize the prompt around for your scripts, Script Kit will store the position and size. If you want to reset the position of you prompts back to the centered defaults, then run this command.
      
## Manage npm Packages

<!-- description: Add and remove npm packages for your kenv -->
<!-- value: cli/manage-npm.js -->
<!-- enter: Manage -->

This will help you install/uninstall packages from your `~/.kenv/node_modules`

> Note: You can use the `npm` method in your script to prompt the user to auto-install:

```js
let express = await npm("express")
```

      
## Switch to JavaScript Mode

<!-- description: Set .env KIT_MODE=js -->
<!-- value: cli/switch-to-js.js -->
<!-- enter: Switch to JS -->

Prefer JavaScript for your scripts? Hit _Enter_!

## Switch to TypeScript Mode

<!-- description: Set .env KIT_MODE=ts -->
<!-- value: cli/switch-to-ts.js -->
<!-- enter: Switch to TS -->

Prefer TypeScript for your scripts? Hit _Enter_!
      
## Sync $PATH from Terminal to Kit.app

<!-- description: Set .env PATH to the terminal $PATH -->
<!-- value: cli/sync-path-instructions.js -->
<!-- enter: Sync PATH -->

Have a command that's working in your terminal, but doesn't work when you call it with Script Kit?

Use this to sync up your "PATH" from your terminal to the "PATH" that Script Kit will use.

You can manually edit a `PATH` value any time in `~/.kenv/.env`
      
## Check for Update

<!-- description: Check for an update to Kit.app -->
<!-- value: cli/update.js -->
<!-- enter: Check for Update -->

Kit.app will check for updates each time your machine wakes from sleep. But if you heard about an update and just can't wait, trigger this command to grab it.


## Open main.log

<!-- description: Open the main.log file -->
<!-- value: cli/main-log.js -->
<!-- enter: Open Log -->

This will open the `main.log` file in your editor. This is where Script Kit logs errors and other information.

## Select Default Display

<!-- description: Always open Kit on a specific display -->
<!-- value: config/set-default-display.js -->
<!-- enter: Select Default Display -->

Force the prompt to always open on a specific display.

## Edit .env

<!-- description: Open the .env file -->
<!-- value: cli/env.js -->
<!-- enter: Edit .env -->

This will open the `.env` file in your editor. This is where Script Kit stores environment variables for your scripts.
      
## Credits

<!-- description: Follow @johnlindquist on Twitter -->
<!-- value: cli/credits.js -->
<!-- enter: Follow @johnlindquist -->

### John Lindquist

Development

- [https://johnlindquist.com](https://johnlindquist.com)
- [@johnlindquist](https://twitter.com/johnlindquist)

### Vojta Holik

Design

- [https://vojta.io/](https://vojta.io/)
- [@vjthlk](https://twitter.com/vjthlk)

### Supported By

- [egghead.io](https://egghead.io)
      
## Quit

<!-- description: Quit Kit.app -->
<!-- value: cli/quit.js -->
<!-- enter: Quit -->

See you soon! 👋
