# Finjector - Financial CCOA Lookup 

This project is available for use by any UC Davis website as a convenient option to lookup, create, and store the CCOA values used by Aggie Enterprise.  If your project needs to collect CCOA values (GL or PPM strings) from your users, call today to find out if Finjector is right for you.

![Finjector Example](https://i.imgur.com/bbfBc4j.gif)

# Live Example

[Follow this link to view a live example](https://ucdavis.github.io/finjector/).  Clicking on the "Lookup" button next to the chart string entry box will bring up the Finjector UI.

You can then create a new GL or PPM account from scratch, or paste in an existing one.  We keep track of prior choices, so if do the lookup again you can just press "Use" and it'll be inserted instantly.

Try using the example PPM account listed below the input box, and choose "Create new chart from paste" to get started quickly.  If you build from scratch, PPM is suggested because there are only four fields, compared to 8 for GL.

# Configure

The simplest way to setup Finjector is to include [our tiny helper JS script](https://github.com/ucdavis/finjector/blob/main/Finjector.Web/ClientApp/public/finjector.js) in your site's HTML

```
<script src="https://finjector.ucdavis.edu/finjector.js?v=1"></script>
```

When your client is ready to enter a CCOA value, you can call

`const result = window.Finjector.findChartSegmentString();`

This will popup our UI and walk the user through the process of finding, saving and selecting a CCOA string.  The `result` return value is a `Promise` which will resolve with the following object.

```
{
    "status": "success",
    "data": "<CCOA segment string>"
}

```

Once you have the full CCOA string, you may want to do extra validation or just stick the value into an input box and be on your way.

# JavaScript Example Configuration (no libraries)

In this example we use raw JS to hookup a click listener to our lookup button and use it to launch Finjector.  We take the resulting value and insert into our input box.

```
const lookup = document.getElementById('lookup');
const ccoaInput = document.getElementById('ccoa-input');

lookup.addEventListener('click', (e) => {
    e.preventDefault();
    const ccoa = ccoaInput.value;

    window.Finjector.findChartSegmentString()
        .then(response => {
            if (response.status === "success") {
                ccoaInput.value = response.data;
            }
        })
});
```

# JQUERY Example Configuration

In this example we'll use JQuery to popup finjector in response to a click of a the "lookup chart" button. 

```
$("#ccoa-picker").on("click",
    async function () {
        const chart = await window.Finjector.findChartSegmentString();
        if (chart?.status === "success") {
            $("#ccoa-input").val(chart.data);
        }
        else {
            alert("Something went wrong with the CCOA picker")
        }
    });
```

# Manual Configuration

Finjector is just a popup window so you don't really need our tiny helper JS script.  It will help you popup a window that's a nice size and well centered, and will take care of validating and destructuring the window `message` response, so we do recommend you use it.  But you can always take a look at the code and just handle it yourself.

## PPM entry defaults

`Financial:DefaultPpmExpenditureTypeCode` in `Finjector.Web/appsettings.json`
defaults to `532304`. When a project is selected on `/entry`, an empty
Expenditure Type is filled with the matching eligible code and name from Aggie
Enterprise. Existing values and text the user is entering are preserved.

To override the default in production, set the application environment variable
`Financial__DefaultPpmExpenditureTypeCode` to the desired code, restart the app,
and reload the page. This is a server setting and does not require rebuilding
the client. Set it to an empty value to disable the default. Missing or
ineligible expenditure types leave the field empty for manual selection.

## User access report

Open **My Teams > User Access Report** to review access across the teams and
folders you administer. The **Actions > User Access Report** option on a team
or folder limits the report to that location. Search the report to narrow the
displayed assignments, then use **Export CSV** to download the visible rows.

Team administrators can report on the team and its active folders. Folder
administrators can report on their folders, including permissions inherited
from the parent team; this does not expose other folders or a separate team
membership report. Personal teams follow the same permission rules.

Each row shows an assigned role and its source. Direct folder permissions and
inherited team permissions are listed separately, so a user can appear more
than once for a folder. Access is cumulative: Admin takes precedence over Edit,
then View. The report includes existing permission assignments even if the user
record is marked inactive, because those assignments still grant access.
Inactive teams and folders are excluded. Use **Refresh** to load current access.

The report endpoint is `GET /api/user/permissions/report`, with optional `teamId`
and `folderId` filters. It enforces the caller's admin scope on the server.
Backend regression checks run with
`dotnet run --project tests/AccessReportChecks/AccessReportChecks.csproj`; they
check permission boundaries and SQL translation without connecting to a database.

## Development: How to run it

You'll need user-secrets from 1pass.

On first run, it'll auto install all nuget and npm packages.  But if you are updating, you'll have to go into ClientApp/ and run `npm install` to stay current.

Otherwise, it's the same as any other app:

In the Finjector.Web directory, type `npm start`

This will launch a "landing page" which spins up our client code and waits for it to be ready.  Once ready it'll auto swap to `https://localhost:3000` and our react code.
