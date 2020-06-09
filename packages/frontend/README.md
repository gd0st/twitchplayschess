# @alphachamp/frontend

The front-end includes the stream display and the AlphaChamp Twitch extension all under the same code-base.

https://github.com/twitchdev/extensions-boilerplate

## Setup

Download the Twitch Extension Developer Rig: https://dev.twitch.tv/docs/extensions/rig/#creating-a-project

Open the project in the developer rig

-   Click `Add Project`, then `Open Project`
-   Select the AlphaChamp.json to open the front-end project

You can click the `Run Front End` button to start the dev script, but I recommend running the script manually with `yarn dev:rig` in a separate terminal.

Go to the `Extension Views` tab to see live previews of the extension views. These will auto-reload when you make a change to the code.

### Notes

-   The first time you run the dev:rig script, you will get a couple "Invalid Certificate" popups in the rig. Make sure you accept all of them.

-   If you get this error

        	```Network error message: getaddrinfo ENOTFOUND localhost.rig.twitch.tv```

        	you need to add `12.0.0.1	localhost.rig.twitch.tv` to your /etc/hosts file.

-   to get css module intellisense in vscode, do the `TypeScript: Select TypeScript Version` command and pick the `workspace version` option.